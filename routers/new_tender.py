from fastapi import APIRouter

router = APIRouter()

@router.post("/tender/new")
def new_tender(name:str):
    return {"message": f"New tender, not implemented yet"}
    