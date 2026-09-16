from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=5)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=2)
    image: str = Field(..., min_length=5)
    stock: int = Field(..., ge=0)
    is_available: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image: Optional[str] = None
    stock: Optional[int] = None
    is_available: Optional[bool] = None

class ProductOut(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    image: str
    stock: int
    is_available: bool
    created_at: datetime
