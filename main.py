from fastapi import FastAPI

from routers.new_tender import router as new_tender_router
from routers.add_file import router as add_file_router
from routers.analyze import router as analyze_router

app = FastAPI()

app.include_router(new_tender_router)
app.include_router(add_file_router)
app.include_router(analyze_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
