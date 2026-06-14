import os

from openai import AsyncOpenAI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

client = AsyncOpenAI(
    base_url=os.getenv("OPENAI_API_URL"),
    api_key=os.getenv("OPENAI_API_KEY")
)

MODEL = os.getenv("MODEL")
DATABASE_URL = os.getenv("DATABASE_URL")
UPLOAD_DIR = Path("uploaded_files")

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "bge-m3")

embedding_client = AsyncOpenAI(
    base_url=os.getenv("EMBEDDING_API_URL"),
    api_key=os.getenv("EMBEDDING_API_KEY"),
)