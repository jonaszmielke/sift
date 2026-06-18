from fastapi import APIRouter

from .new import router as new_router
from .list import router as list_router
from .detail import router as detail_router
from .add_files import router as add_files_router
from .analyze import router as analyze_router
from .embed import router as embed_router

router = APIRouter(tags=["tender"])
router.include_router(new_router)
router.include_router(list_router)
router.include_router(detail_router)
router.include_router(add_files_router)
router.include_router(analyze_router)
router.include_router(embed_router)
