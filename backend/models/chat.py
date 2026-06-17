from datetime import datetime, UTC
from enum import StrEnum
from uuid import UUID, uuid7
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON

from typing import Optional, TYPE_CHECKING
if TYPE_CHECKING:
    from models.tender import Tender

class MessageRole(StrEnum):
    user = "user"
    assistant = "assistant"

class Conversation(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid7, primary_key=True)
    
    tender_id: UUID = Field(foreign_key="tender.id", index=True, ondelete="CASCADE")
    tender: Optional["Tender"] = Relationship(back_populates="conversations")

    title: str = Field(default="New chat")

    messages: list["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"order_by": "Message.created_at"},
        cascade_delete=True,
        passive_deletes=True
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        sa_column_kwargs={"onupdate": lambda: datetime.now(UTC)},
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    
class Message(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid7, primary_key=True)
    
    conversation_id: UUID = Field(foreign_key="conversation.id", index=True, ondelete="CASCADE")
    conversation: Conversation = Relationship(back_populates="messages")

    role: MessageRole
    content: str
    sources: list[dict] | None = Field(default=None, sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    