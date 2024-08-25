from fastapi import FastAPI
from app.api.v2.routers import user, item

v2 = FastAPI()

v2.include_router(user.router, prefix="/users", tags=["users"])
v2.include_router(item.router, prefix="/items", tags=["items"])

@v2.get("/")
def read_root():
    return {"message": "Welcome to API version 2"}
