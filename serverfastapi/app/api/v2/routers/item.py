from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def read_items():
    return {"message": "Version 2. List of items"}

@router.get("/a")
def readItemA():
    return {"message": "Version 2. ,A"}

@router.post("/")
def create_item():
    return {"message": "Version 2. Item created"}
