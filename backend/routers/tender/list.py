from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_session
from models import Tender, TenderStatus

router = APIRouter()

TENDERS_PER_PAGE = 10


class TenderListItem(BaseModel):
    id: UUID
    name: str
    status: TenderStatus
    value: float | None
    currency: str | None
    deadline: datetime | None
    procuring_entity: str | None

    model_config = {"from_attributes": True}


class TenderListResponse(BaseModel):
    tenders: list[TenderListItem]
    next_cursor: UUID | None


@router.get("/tenders", response_model=TenderListResponse)
async def get_tenders_list(lastId: str | None = None, session: AsyncSession = Depends(get_session)):
    query = (
        select(
            Tender.id,
            Tender.name,
            Tender.status,
            Tender.value,
            Tender.currency,
            Tender.deadline,
            Tender.procuring_entity,
        )
        .order_by(Tender.id)
        .limit(TENDERS_PER_PAGE)
    )

    if lastId is not None:
        query = query.where(Tender.id > lastId)

    result = await session.exec(query)
    tenders = result.all()

    next_cursor = tenders[-1].id if len(tenders) == TENDERS_PER_PAGE else None

    return {"tenders": tenders, "next_cursor": next_cursor}
