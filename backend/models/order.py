from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class OrderItemInput(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=5)
    customer_address: str = Field(..., min_length=5)
    items: List[OrderItemInput] = Field(..., min_items=1)

class OrderItemOut(BaseModel):
    product_id: str
    name: str
    price: float
    image: str
    quantity: int
    total_price: float

class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Pending|Confirmed|Preparing|Shipped|Delivered|Cancelled)$")

class OrderOut(BaseModel):
    id: str
    order_id: str
    customer_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    items: List[OrderItemOut]
    subtotal: float
    tax: float
    total: float
    status: str
    created_at: datetime
