from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.models import CartItem as CartItemModel, Product as ProductModel
from ..schemas.schemas import CartItem, CartItemCreate
from ..security import get_current_active_user
from ..models.models import User

router = APIRouter()

@router.get("/", response_model=List[CartItem])
def get_cart_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(CartItemModel).filter(CartItemModel.user_id == current_user.id).all()

@router.post("/", response_model=CartItem)
def add_to_cart(
    cart_item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if product exists and has enough stock
    product = db.query(ProductModel).filter(ProductModel.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.stock < cart_item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")

    # Check if item already exists in cart
    existing_item = db.query(CartItemModel).filter(
        CartItemModel.user_id == current_user.id,
        CartItemModel.product_id == cart_item.product_id
    ).first()

    if existing_item:
        # Update quantity if item exists
        new_quantity = existing_item.quantity + cart_item.quantity
        if new_quantity > product.stock:
            raise HTTPException(status_code=400, detail="Not enough stock available")
        
        existing_item.quantity = new_quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    # Create new cart item
    db_cart_item = CartItemModel(
        user_id=current_user.id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity
    )
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

@router.put("/{cart_item_id}", response_model=CartItem)
def update_cart_item(
    cart_item_id: int,
    cart_item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if cart item exists and belongs to user
    db_cart_item = db.query(CartItemModel).filter(
        CartItemModel.id == cart_item_id,
        CartItemModel.user_id == current_user.id
    ).first()
    
    if not db_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    # Check if product has enough stock
    product = db.query(ProductModel).filter(ProductModel.id == db_cart_item.product_id).first()
    if product.stock < cart_item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")

    # Update quantity
    db_cart_item.quantity = cart_item.quantity
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

@router.delete("/{cart_item_id}")
def remove_from_cart(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if cart item exists and belongs to user
    db_cart_item = db.query(CartItemModel).filter(
        CartItemModel.id == cart_item_id,
        CartItemModel.user_id == current_user.id
    ).first()
    
    if not db_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(db_cart_item)
    db.commit()
    return {"message": "Item removed from cart"}

@router.delete("/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db.query(CartItemModel).filter(CartItemModel.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared successfully"} 