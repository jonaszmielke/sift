from fastapi import APIRouter
from .manage import router as manage_router
from .list import router as list_router
from .messages import router as messages_router

router = APIRouter(tags=["conversations"])

router.include_router(manage_router)
router.include_router(list_router)
router.include_router(messages_router)