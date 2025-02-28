from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from typing import List, Optional
from ..models.models import Category as CategoryModel
from ..schemas.schemas import Category, CategoryCreate, CategoryUpdate
from ..security import check_admin_user

router = APIRouter()

# @router.get("/")
#async def get_categories(db: Session = Depends(get_db)):
#    return {"message": "Categories endpoint"} 


#@router.get("/")
#async def get_categories()

# Récupérer toutes les catégories (avec pagination et recherche)
@router.get("/", response_model=List[Category])
def get_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CategoryModel)

    if search:
        query = query.filter(CategoryModel.name.ilike(f"%{search}%"))

    categories = query.offset(skip).limit(limit).all()
    return categories

# Ajouter une nouvelle catégorie (admin seulement)
@router.post("/", response_model=Category)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_user)  # Vérifie si l'utilisateur est admin
):
    db_category = CategoryModel(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# Récupérer une catégorie par ID
@router.get("/{category_id}", response_model=Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

# Modifier une catégorie (admin seulement)
@router.put("/{category_id}", response_model=Category)
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_user)
):
    db_category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, value in category.model_dump().items():
        setattr(db_category, key, value)

    db.commit()
    db.refresh(db_category)
    return db_category

#  Supprimer une catégorie (admin seulement)
@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_user)
):
    db_category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}