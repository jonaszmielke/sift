from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID, uuid7
from database import get_session
from pypdf import PdfReader
import io
import asyncio
from models import Tender, File as FileModel

from config import UPLOAD_DIR

router = APIRouter()

def extractText(content: bytes):
    reader = PdfReader(io.BytesIO(content))
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text


@router.post("/tender/add-file")
async def add_file(tenderId: UUID = Form(...), file: UploadFile = File(...), session: AsyncSession = Depends(get_session)):

    content = await file.read()
    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="File is not a PDF")

    tender = await session.get(Tender, tenderId)
    if tender is None:
        raise HTTPException(status_code=404, detail="Tender not found")

    text = await asyncio.to_thread(extractText, content)
    
    file_id = uuid7()
    destination = UPLOAD_DIR / str(tenderId) / f"{file_id}.pdf"

    destination.parent.mkdir(parents=True, exist_ok=True)
    await asyncio.to_thread(destination.write_bytes, content)


    fileRow = FileModel(
        id=file_id,
        tender_id=tenderId,
        filename=file.filename,
        extracted_text=None,
    )

    session.add(fileRow)
    await session.commit()
    await session.refresh(fileRow)

    return {"fileId": fileRow.id}