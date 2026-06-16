from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel.ext.asyncio.session import AsyncSession
from database import get_session
from models import Tender, File, TenderStatus
from sqlmodel import select

router = APIRouter()
class NewTenderRequest(BaseModel):
    name: str


@router.post("/tender/new")
async def new_tender(body: NewTenderRequest, session: AsyncSession = Depends(get_session)):

    tender = Tender(name=body.name)

    session.add(tender)
    await session.commit()
    await session.refresh(tender)

    return {"tender_id": tender.id}
    

TENDERS_PER_PAGE = 10

@router.get("/tenders")
async def get_tenders_list(lastId: str | None = None, session: AsyncSession = Depends(get_session)):
    query = select(Tender.id, Tender.name, Tender.status).order_by(Tender.id).limit(TENDERS_PER_PAGE)

    if lastId is not None:
        query = query.where(Tender.id > lastId)

    result = await session.exec(query)
    tenders = result.all()

    next_cursor = tenders[-1].id if len(tenders) == TENDERS_PER_PAGE else None

    return {"tenders": tenders, "next_cursor": next_cursor}


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