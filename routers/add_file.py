from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from uuid import UUID
from database import get_session
from sqlmodel import Session

router = APIRouter()

@router.post("/tender/{tenderId}/add-file")
async def add_file(tenderId: UUID, file: UploadFile = File(...), session: Session = Depends(get_session)):

    content = await file.read()
    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="File is not a PDF")

    return {"message": f"Add file, not implemented yet"}