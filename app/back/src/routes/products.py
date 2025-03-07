from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.models import Product as ProductModel
from ..schemas.schemas import Product, ProductCreate
from ..security import check_admin_user
from sqlalchemy import or_

router = APIRouter()

@router.get("/", response_model=List[Product])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    status: Optional[str] = "published",
    db: Session = Depends(get_db)
):
    query = db.query(ProductModel)

    # Apply filters
    if search:
        search_filter = or_(
            ProductModel.name.ilike(f"%{search}%"),
            ProductModel.short_description.ilike(f"%{search}%"),
            ProductModel.long_description.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if category_id:
        query = query.filter(ProductModel.category_id == category_id)
    
    if brand_id:
        query = query.filter(ProductModel.brand_id == brand_id)
    
    if min_price is not None:
        query = query.filter(ProductModel.price >= min_price)
    
    if max_price is not None:
        query = query.filter(ProductModel.price <= max_price)
    
    if status:
        query = query.filter(ProductModel.status == status)

    # Apply pagination
    total = query.count()
    products = query.offset(skip).limit(limit).all()

    # Add total count in response headers
    return products

@router.post("/", response_model=Product)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_user)
):
    db_product = ProductModel(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_user)
):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_user)
):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"} 