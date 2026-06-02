import asyncio
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from pypdf import PdfReader

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World"}


def extractText(content: bytes):
    reader = PdfReader(io.BytesIO(content))
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()

    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="File is not a PDF")

    text = await asyncio.to_thread(extractText, content)

    return {"content": text}
    
