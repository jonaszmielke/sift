from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from database import get_session
from models import Conversation
from sqlmodel import select
from sqlalchemy import tuple_
from pydantic import BaseModel

router = APIRouter()

CONVERSATIONS_PER_PAGE = 5

class ConversationListItem(BaseModel):
    id: UUID
    title: str
    updated_at: datetime
    model_config = {"from_attributes": True}

class ConversationCursor(BaseModel):
    updated_at: datetime
    id: UUID

class ConversationListResponse(BaseModel):
    conversations: list[ConversationListItem]
    nextCursor: ConversationCursor | None


@router.get("/conversations/list", response_model=list[ConversationListItem])
async def list_conversations(
    tenderId: UUID,
    cursorUpdatedAt: datetime | None = None,
    cursorId: UUID | None = None,
    session: AsyncSession = Depends(get_session),
):
    query = (
        select(Conversation.id, Conversation.title, Conversation.updated_at)
        .where(Conversation.tender_id == tenderId)
        .order_by(Conversation.updated_at.desc(), Conversation.id.desc())
        .limit(CONVERSATIONS_PER_PAGE)
    )

    if cursorUpdatedAt is not None and cursorId is not None:
        query = query.where(
            tuple_(Conversation.updated_at, Conversation.id)
            < tuple_(cursorUpdatedAt, cursorId)
        )

    rows = (await session.exec(query)).all()
    nextCursor = (
        ConversationCursor(updated_at=rows[-1].updated_at, id=rows[-1].id)
        if len(rows) == CONVERSATIONS_PER_PAGE
        else None
    )

    return {"conversations": rows, "nextCursor": nextCursor}