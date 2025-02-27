from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter()

@router.get("/")
async def get_categories(db: Session = Depends(get_db)):
    return {"message": "Categories endpoint"} 