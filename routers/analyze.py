from services.tenderAnalysis import runTenderAnalisis
from datetime import datetime, UTC
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_session
from models import Tender, File as FileModel, TenderStatus
from pydantic import BaseModel

router = APIRouter()

def _strip_fences(s: str) -> str:
    s = s.strip()
    if s.startswith("```"):
        s = s.split("\n", 1)[1] if "\n" in s else s[3:]
        if s.endswith("```"):
            s = s[: -3]
    return s.strip()

class AnalyzeTenderRequest(BaseModel):
    tenderId: UUID

@router.post("/tender/{tenderId}/analyze")
async def analyze(tenderId: UUID, session: AsyncSession = Depends(get_session)):

    tender = await session.get(Tender, tenderId)
    if tender is None:
        raise HTTPException(404, "Tender not found")

    result = await session.exec(select(FileModel).where(FileModel.tender_id == tenderId))
    files = result.all()
    if not files:
        raise HTTPException(400, "Tender has no files")

    filesHaveText = any(f.extracted_text for f in files)
    if not filesHaveText:
        raise HTTPException(422, "No text in files")

    combined: list[str] = []
    for i in range(len(files)):
        combined.append(f"File {i + 1}:\n{files[i].extracted_text}")

    combinedText = "\n\n".join(combined)

    analysis = await runTenderAnalisis(combinedText)

    if analysis == False:
        raise HTTPException(status_code=502, detail="Model returned invalid analysis")

    tender.title = analysis.title
    tender.deadline = (datetime.fromisoformat(analysis.deadline) if analysis.deadline else None)
    tender.value = analysis.estimated_value
    tender.currency = analysis.currency
    tender.procuring_entity = analysis.procuring_entity
    tender.subject_description = analysis.subject_description
    tender.evaluation_criteria = analysis.evaluation_criteria
    tender.key_requirements = analysis.key_requirements
    tender.analyzed_at = datetime.now(UTC)
    tender.status = TenderStatus.analyzed

    session.add(tender)
    await session.commit()
    await session.refresh(tender)

    return {"message": "Tender analyzed successfully"}
