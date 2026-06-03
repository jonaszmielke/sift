from fastapi import FastAPI

from routers import analyze

app = FastAPI()
app.include_router(analyze.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
