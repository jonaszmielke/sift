import asyncio
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import select, delete
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_session
from config import client, MODEL
from models import Tender, File as FileModel, Chunk
from services.chunking import chunk_text
from services.embeddings import embed_text, embed_batch

router = APIRouter()


@router.post("/tender/{tenderId}/embed")
async def embed_tender(tenderId: UUID, session: AsyncSession = Depends(get_session)):
    tender = await session.get(Tender, tenderId)
    if tender is None:
        raise HTTPException(404, "Tender not found")

    files = (
        await session.exec(select(FileModel).where(FileModel.tender_id == tenderId))
    ).all()

    counts: dict[str, int] = {}
    for file in files:
        if not file.extracted_text:
            continue
        # idempotent: drop existing chunks for this file first
        await session.exec(delete(Chunk).where(Chunk.file_id == file.id))

        chunks = await asyncio.to_thread(chunk_text, file.extracted_text)
        if not chunks:
            counts[str(file.id)] = 0
            continue
        vectors = await embed_batch(chunks)
        for i, (content, vector) in enumerate(zip(chunks, vectors)):
            session.add(Chunk(content=content, embedding=vector, chunk_index=i, file_id=file.id))
        counts[str(file.id)] = len(chunks)

    await session.commit()
    return {"chunks_created": counts}


class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


@router.post("/tender/{tenderId}/chat")
async def chat(tenderId: UUID, body: ChatRequest, session: AsyncSession = Depends(get_session)):
    tender = await session.get(Tender, tenderId)
    if tender is None:
        raise HTTPException(404, "Tender not found")

    query_vec = await embed_text(body.message)

    # vector search scoped to THIS tender's files only
    stmt = (
        select(Chunk)
        .join(FileModel, Chunk.file_id == FileModel.id)
        .where(FileModel.tender_id == tenderId)
        .order_by(Chunk.embedding.cosine_distance(query_vec))
        .limit(5)
    )
    hits = (await session.exec(stmt)).all()

    context_block = "\n\n".join(f"[file={h.file_id} chunk={h.chunk_index}]\n{h.content}" for h in hits)
    system = (
        "You answer questions about a public procurement tender using ONLY the "
        "document excerpts below. If the answer is not in them, say so. "
        "Cite the file/chunk when useful.\n\n"
        f"{context_block}"
    )   

    messages = [{"role": "system", "content": system}]
    messages += [{"role": m.role, "content": m.content} for m in body.history]
    messages.append({"role": "user", "content": body.message})
    
    # proxy forces SSE -> stream then join
    stream = await client.chat.completions.create(
        model=MODEL, messages=messages, stream=True,
    )   
    parts: list[str] = []
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            parts.append(delta)
    reply = "".join(parts)
    
    return {
        "reply": reply,
        "sources": [
            {"file_id": h.file_id, "chunk_index": h.chunk_index, "content": h.content}
            for h in hits
        ],
    }
