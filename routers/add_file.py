from fastapi import APIRouter
from uuid import UUID

router = APIRouter()

@router.post("/tender/{tenderId}/add-file")
def add_file(tenderId: UUID):
    return {"message": f"Add file, not implemented yet"}