from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_session
from models import Tender, File, TenderStatus

router = APIRouter()


class FileSummary(BaseModel):
    id: UUID
    filename: str


class TenderDetail(BaseModel):
    id: UUID
    name: str
    status: TenderStatus
    title: str | None
    deadline: datetime | None
    value: float | None
    currency: str | None
    procuring_entity: str | None
    subject_description: str | None
    evaluation_criteria: list[str] | None
    key_requirements: list[str] | None
    analyzed_at: datetime | None
    created_at: datetime
    files: list[FileSummary]

    model_config = {"from_attributes": True}


@router.get("/tender/{id}", response_model=TenderDetail)
async def get_tender(id: str, session: AsyncSession = Depends(get_session)):
    query = (
        select(Tender)
        .where(Tender.id == id)
        .options(selectinload(Tender.files).load_only(File.id, File.filename))
    )
    result = await session.exec(query)
    tender = result.first()

    if tender is None:
        raise HTTPException(status_code=404, detail="Tender not found")

    return tender
