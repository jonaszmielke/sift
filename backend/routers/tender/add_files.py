import asyncio
import io
from uuid import UUID, uuid7

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pypdf import PdfReader
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_session
from config import UPLOAD_DIR
from models import Tender, File as FileModel
from services.files.vectorize import vectorize_file

router = APIRouter()


def extractText(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


@router.post("/tender/{tenderId}/add-files")
async def add_files(
    tenderId: UUID,
    files: list[UploadFile] = File(...),
    session: AsyncSession = Depends(get_session),
):
    tender = await session.get(Tender, tenderId)
    if tender is None:
        raise HTTPException(404, "Tender not found")

    results: list[dict] = []
    for upload in files:
        destination = None
        try:
            content = await upload.read()
            if not content.startswith(b"%PDF"):
                results.append(
                    {"filename": upload.filename, "status": "error", "detail": "File is not a PDF"}
                )
                continue

            text = await asyncio.to_thread(extractText, content)

            file_id = uuid7()
            destination = UPLOAD_DIR / str(tenderId) / f"{file_id}.pdf"
            destination.parent.mkdir(parents=True, exist_ok=True)
            await asyncio.to_thread(destination.write_bytes, content)

            session.add(
                FileModel(
                    id=file_id,
                    tender_id=tenderId,
                    filename=upload.filename,
                    extracted_text=text,
                )
            )
            chunks_created = await vectorize_file(session, file_id, text)
            await session.commit()

            results.append(
                {
                    "filename": upload.filename,
                    "file_id": str(file_id),
                    "chunks_created": chunks_created,
                    "status": "ok",
                }
            )
        except Exception as e:
            await session.rollback()
            if destination is not None:
                destination.unlink(missing_ok=True)
            results.append({"filename": upload.filename, "status": "error", "detail": str(e)})

    return {"results": results}
