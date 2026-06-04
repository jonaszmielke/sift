import os

from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(
    base_url=os.getenv("OPENAI_API_URL"),
    api_key=os.getenv("OPENAI_API_KEY")
)

MODEL = os.getenv("MODEL")
DATABASE_URL = os.getenv("DATABASE_URL")