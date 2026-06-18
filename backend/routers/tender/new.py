from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_session
from models import Tender

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
