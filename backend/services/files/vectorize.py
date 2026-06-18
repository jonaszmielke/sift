import asyncio
from uuid import UUID

from sqlmodel import delete
from sqlmodel.ext.asyncio.session import AsyncSession

from models import Chunk
from services.files.chunking import chunk_text
from services.files.embeddings import embed_batch


async def vectorize_file(session: AsyncSession, file_id: UUID, text: str) -> int:
    """Chunk + embed `text` into Chunk rows for `file_id`. Idempotent: drops existing
    chunks first. Adds rows to the session but does NOT commit — the caller owns the
    transaction. Returns the number of chunks created."""
    await session.exec(delete(Chunk).where(Chunk.file_id == file_id))

    chunks = await asyncio.to_thread(chunk_text, text)
    if not chunks:
        return 0

    vectors = await embed_batch(chunks)
    for i, (content, vector) in enumerate(zip(chunks, vectors)):
        session.add(Chunk(content=content, embedding=vector, chunk_index=i, file_id=file_id))
    return len(chunks)
