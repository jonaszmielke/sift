import asyncio
from sqlalchemy import text
from database import engine
import models  # registers all tables on SQLModel.metadata
from models import SQLModel

async def main():
    async with engine.begin() as conn:
        await conn.execute(text("DROP SCHEMA public CASCADE"))
        await conn.execute(text("CREATE SCHEMA public"))
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(SQLModel.metadata.create_all)
        await conn.execute(text(
            "CREATE INDEX ix_chunk_embedding_hnsw ON chunk "
            "USING hnsw (embedding vector_cosine_ops)"
        ))
    print("reset done")

asyncio.run(main())