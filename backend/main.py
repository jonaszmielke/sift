from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.tender import router as tender_router
from routers.conversation import router as conversation_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tender_router)
app.include_router(conversation_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
