from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_items():
    return {"message": "Version 1. List of items"}

@router.get("/a")
def readItemA():
    return {"message": "Version 1. ,A"}
@router.post("/")
def create_item():
    return {"message": "Version 1. Item created"}
