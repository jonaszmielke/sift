from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.tenders import router as tenders_router
from routers.add_file import router as add_file_router
from routers.analyze import router as analyze_router
from routers.rag import router as rag_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tenders_router)
app.include_router(add_file_router)
app.include_router(analyze_router)
app.include_router(rag_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
