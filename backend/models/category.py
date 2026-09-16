from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = ""
    image: Optional[str] = ""

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None

class CategoryOut(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = ""
    image: Optional[str] = ""
    created_at: datetime
