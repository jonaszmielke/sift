from datetime import datetime, UTC
from enum import StrEnum
from uuid import UUID, uuid7

from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship
from pgvector.sqlalchemy import Vector

class TenderStatus(StrEnum):
    pending = "pending"
    analyzed = "analyzed"

class Tender(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid7, primary_key=True)
    name: str 
    status: TenderStatus = TenderStatus.pending

    files: list["File"] = Relationship(
        back_populates="tender",
        sa_relationship_kwargs={"order_by": "File.uploaded_at"},
    )
    
    # analysis fields (nullable until analyzed):
    title: str | None = None
    deadline: datetime | None = None
    value: float | None = None
    currency: str | None = None
    procuring_entity: str | None = None
    subject_description: str | None = None
    evaluation_criteria: list[str] | None = Field(default=None, sa_column=Column(JSON))
    key_requirements: list[str] | None = Field(default=None, sa_column=Column(JSON))
    analyzed_at: datetime | None = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class File(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid7, primary_key=True)
    filename: str
    extracted_text: str | None = None

    tender_id: UUID = Field(foreign_key="tender.id", index=True)
    tender: Tender | None = Relationship(back_populates="files")

    chunks: list["Chunk"] = Relationship(back_populates="file", cascade_delete=True)
    
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class Chunk(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid7, primary_key=True)

    file_id: UUID = Field(foreign_key="file.id", index=True, ondelete="CASCADE")
    file: File | None = Relationship(back_populates="chunks")
    
    chunk_index: int
    content: str
    embedding: list[float] = Field(sa_column=Column(Vector(1024)))
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))