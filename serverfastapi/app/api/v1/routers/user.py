from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_users():
    return {"message": "Version 1. List of users"}

@router.get("/single")
def showSingleUser():
    return {"message": "Version 1. Single User"}

@router.post("/")
def create_user():
    return {"message": "Version 1. User created"}
