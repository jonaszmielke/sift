from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from database import get_session
from models import Message, MessageRole

router = APIRouter()

MESSAGES_PER_PAGE = 5

class MessageItem(BaseModel):
    id: UUID
    role: MessageRole
    content: str
    sources: list[dict] | None
    created_at: datetime
    model_config = {"from_attributes": True}

class MessageListResponse(BaseModel):
    messages: list[MessageItem]
    nextCursor: UUID | None

@router.get("/conversations/messages", response_model=MessageListResponse)
async def list_messages(
    conversationId: UUID,
    cursorId: UUID | None = None,
    session: AsyncSession = Depends(get_session),
):
    query = (
        select(Message)
        .where(Message.conversation_id == conversationId)
        .order_by(Message.id.desc())
        .limit(MESSAGES_PER_PAGE)
    )

    if cursorId is not None:
        query = query.where(Message.id < cursorId)

    rows = (await session.exec(query)).all()
    
    nextCursor = rows[-1].id if len(rows) == MESSAGES_PER_PAGE else None

    return {"messages": rows, "nextCursor": nextCursor}