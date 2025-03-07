from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.models import (
    Order as OrderModel,
    OrderItem as OrderItemModel,
    CartItem as CartItemModel,
    Product as ProductModel
)
from ..schemas.schemas import Order, OrderCreate
from ..security import get_current_active_user, check_admin_user
from ..models.models import User
from sqlalchemy import and_

router = APIRouter()

@router.get("/", response_model=List[Order])
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Regular users can only see their own orders
    if current_user.role != "admin":
        return db.query(OrderModel).filter(OrderModel.user_id == current_user.id).all()
    # Admins can see all orders
    return db.query(OrderModel).all()

@router.get("/{order_id}", response_model=Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(OrderModel).filter(OrderModel.id == order_id)
    if current_user.role != "admin":
        query = query.filter(OrderModel.user_id == current_user.id)
    
    order = query.first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=Order)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get cart items
    cart_items = db.query(CartItemModel).filter(CartItemModel.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Validate stock availability and calculate total
    total_amount = 0
    order_items = []
    products_to_update = []

    for cart_item in cart_items:
        product = db.query(ProductModel).filter(ProductModel.id == cart_item.product_id).first()
        
        if not product:
            raise HTTPException(
                status_code=400,
                detail=f"Product with id {cart_item.product_id} not found"
            )
        
        if product.stock < cart_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for product {product.name}"
            )
        
        # Calculate item total and prepare order item
        item_total = product.price * cart_item.quantity
        total_amount += item_total
        
        order_items.append({
            "product_id": product.id,
            "quantity": cart_item.quantity,
            "unit_price": product.price
        })
        
        # Update product stock
        product.stock -= cart_item.quantity
        products_to_update.append(product)

    # Create order
    db_order = OrderModel(
        user_id=current_user.id,
        total_amount=total_amount,
        shipping_address=order.shipping_address,
        status="pending"
    )
    db.add(db_order)
    db.flush()  # Get order ID without committing

    # Create order items
    for item in order_items:
        db_order_item = OrderItemModel(
            order_id=db_order.id,
            product_id=item["product_id"],
            quantity=item["quantity"],
            unit_price=item["unit_price"]
        )
        db.add(db_order_item)

    # Clear cart
    db.query(CartItemModel).filter(CartItemModel.user_id == current_user.id).delete()

    # Commit all changes
    db.commit()
    db.refresh(db_order)
    return db_order

@router.put("/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_user)
):
    valid_statuses = ["pending", "paid", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Handle cancellation
    if status == "cancelled" and order.status != "cancelled":
        # Restore product stock
        order_items = db.query(OrderItemModel).filter(OrderItemModel.order_id == order.id).all()
        for item in order_items:
            product = db.query(ProductModel).filter(ProductModel.id == item.product_id).first()
            if product:
                product.stock += item.quantity

    order.status = status
    db.commit()
    return {"message": f"Order status updated to {status}"}

@router.get("/user/{user_id}", response_model=List[Order])
def get_user_orders(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_user)
):
    return db.query(OrderModel).filter(OrderModel.user_id == user_id).all() 