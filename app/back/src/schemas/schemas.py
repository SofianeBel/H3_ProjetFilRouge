from pydantic import BaseModel, EmailStr, constr, condecimal
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# Base schemas
class UserBase(BaseModel):
    full_name: str
    email: EmailStr

class UserCreate(UserBase):
    password: constr(min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_category_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BrandBase(BaseModel):
    name: str
    logo: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class Brand(BrandBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductImageBase(BaseModel):
    image_url: str
    is_principal: bool = False

class ProductImageCreate(ProductImageBase):
    product_id: int

class ProductImage(ProductImageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    short_description: str
    long_description: Optional[str] = None
    price: condecimal(decimal_places=2)
    stock: int
    status: str
    reference: str
    category_id: int
    brand_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    images: List[ProductImage] = []

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: condecimal(decimal_places=2)

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_address: str
    total_amount: condecimal(decimal_places=2)

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    user_id: int
    order_date: datetime
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    user_id: int
    added_at: datetime

    class Config:
        from_attributes = True

class PaymentBase(BaseModel):
    payment_method: str
    amount: condecimal(decimal_places=2)
    transaction_id: Optional[str] = None

class PaymentCreate(PaymentBase):
    order_id: int

class Payment(PaymentBase):
    id: int
    order_id: int
    payment_date: datetime
    status: str

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 