from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from config import DATABASE_URL

engine = create_async_engine(DATABASE_URL)

async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session():
    async with async_session_maker() as session:
        yield session

