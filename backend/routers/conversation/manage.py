from models import Conversation
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from database import get_session
from models import Tender
from pydantic import BaseModel

router = APIRouter()

class NewConversationRequest(BaseModel):
    tender_id: UUID

@router.post("/conversations/new")
async def create_conversation(body: NewConversationRequest, session: AsyncSession = Depends(get_session)):

    tender = await session.get(Tender, body.tender_id)
    
    if tender is None:
        raise HTTPException(404, "Tender not found")

    conversation = Conversation(tender_id=body.tender_id)

    session.add(conversation)
    await session.commit()
    await session.refresh(conversation)

    return {"id": conversation.id}


@router.delete("/conversations/{conversationId}")
async def delete_conversation(conversationId: UUID, session: AsyncSession = Depends(get_session)):

    conversation = await session.get(Conversation, conversationId)

    if conversation is None:
        raise HTTPException(404, "Conversation not found")

    await session.delete(conversation)
    await session.commit()
    return {"ok": True}