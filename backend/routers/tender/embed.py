from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_session
from models import Tender, File as FileModel
from services.files.vectorize import vectorize_file

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
        counts[str(file.id)] = await vectorize_file(session, file.id, file.extracted_text)

    await session.commit()
    return {"chunks_created": counts}
