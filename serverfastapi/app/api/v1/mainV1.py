from fastapi import FastAPI
from app.api.v1.routers import user, item, sentenceChecker

v1 = FastAPI()
v1.include_router(user.router, prefix="/users", tags=["users"])
v1.include_router(item.router, prefix="/items", tags=["items"])
v1.include_router(sentenceChecker.router, prefix="/checkSentence", tags=["checkSentence"])

@v1.get("/")
def read_root():
    return {"message": "Welcome to API version 1"} 
