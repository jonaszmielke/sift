import asyncio
import json
from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_session
from config import client, MODEL
from models import Conversation, MessageRole, Message, Tender, File as FileModel, Chunk
from services.files.embeddings import embed_text
from services.conversation.generateTitle import generate_title

router = APIRouter()

class ChatRequest(BaseModel):
    message: str


def sse(event: str, data) -> str:
    """One Server-Sent Event: an `event:` line + a single-line JSON `data:` line, terminated by a blank line."""
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


@router.post("/conversations/{conversationId}/send")
async def chat(conversationId: UUID, body: ChatRequest, session: AsyncSession = Depends(get_session)):

    conversation = await session.get(Conversation, conversationId)
    if conversation is None:
        raise HTTPException(404, "Conversation not found")

    tender = await session.get(Tender, conversation.tender_id)
    if tender is None:
        raise HTTPException(404, "Conversation's tender not found")

    # persist the user turn first — recoverable even if streaming fails later
    userMessage = Message(
        role=MessageRole.user,
        content=body.message,
        conversation_id=conversationId,
    )
    session.add(userMessage)
    await session.commit()

    # embed the question + vector search scoped to THIS tender's files
    queryVector = await embed_text(body.message)
    stmt = (
        select(Chunk)
        .join(FileModel, Chunk.file_id == FileModel.id)
        .where(FileModel.tender_id == conversation.tender_id)
        .order_by(Chunk.embedding.cosine_distance(queryVector))
        .limit(5)
    )
    hits = (await session.exec(stmt)).all()

    sources = [
        {"file_id": str(hit.file_id), "chunk_index": hit.chunk_index, "content": hit.content}
        for hit in hits
    ]

    contextBlock = "\n\n".join(
        f"[file={hit.file_id} chunk={hit.chunk_index}]\n{hit.content}" for hit in hits
    )
    system = (
        "You answer questions about a public procurement tender using ONLY the "
        "document excerpts below. If the answer is not in them, say so. "
        "Cite the file/chunk when useful.\n\n"
        f"{contextBlock}"
    )

    # history already includes the user message we just saved (it's the tail)
    historyQuery = (
        select(Message.role, Message.content)
        .where(Message.conversation_id == conversationId)
        .order_by(Message.created_at)
    )
    history = (await session.exec(historyQuery)).all()

    messages = [{"role": "system", "content": system}]
    messages += [{"role": m.role, "content": m.content} for m in history]

    async def event_stream():
        try:
            # citations first — known before any token is generated
            yield sse("sources", sources)

            # title generation runs concurrently with the chat stream
            titleTask = (
                asyncio.create_task(generate_title(body.message))
                if conversation.title is None else None
            )

            # stream chat tokens to the client as they arrive from the proxy
            stream = await client.chat.completions.create(
                model=MODEL, messages=messages, stream=True,
            )
            parts: list[str] = []
            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    parts.append(delta)
                    yield sse("token", {"delta": delta})
            reply = "".join(parts)

            # title ran in the background while we streamed — collect it now
            if titleTask is not None:
                conversation.title = await titleTask

            # persist the assistant turn + bump recency for the list sort
            assistant_message = Message(
                role=MessageRole.assistant,
                content=reply,
                conversation_id=conversationId,
                sources=sources,
            )
            session.add(assistant_message)
            conversation.updated_at = datetime.now(UTC)
            session.add(conversation)
            await session.commit()
            await session.refresh(assistant_message)

            yield sse("done", {
                "message_id": str(assistant_message.id),
                "title": conversation.title,
            })
        except Exception as e:
            await session.rollback()
            yield sse("error", {"detail": str(e)})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
