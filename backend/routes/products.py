from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from database import get_database
from models.product import ProductCreate, ProductUpdate, ProductOut
from utils.auth import get_current_admin

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[ProductOut])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = Query(None, description="price_asc, price_desc, newests"),
    is_available: Optional[bool] = None
):
    db = get_database()
    query = {}
    
    if category and category.lower() != "all":
        query["category"] = category
        
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
        
    if is_available is not None:
        query["is_available"] = is_available

    cursor = db.products.find(query)
    
    if sort == "price_asc":
        cursor = cursor.sort("price", 1)
    elif sort == "price_desc":
        cursor = cursor.sort("price", -1)
    else:
        cursor = cursor.sort("created_at", -1)

    products = []
    async for doc in cursor:
        products.append(ProductOut(
            id=str(doc["_id"]),
            name=doc["name"],
            description=doc["description"],
            price=doc["price"],
            category=doc["category"],
            image=doc["image"],
            stock=doc["stock"],
            is_available=doc.get("is_available", True),
            created_at=doc["created_at"]
        ))
    return products

@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str):
    db = get_database()
    doc = await db.products.find_one({"_id": product_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found."
        )
    return ProductOut(
        id=str(doc["_id"]),
        name=doc["name"],
        description=doc["description"],
        price=doc["price"],
        category=doc["category"],
        image=doc["image"],
        stock=doc["stock"],
        is_available=doc.get("is_available", True),
        created_at=doc["created_at"]
    )

@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    admin: dict = Depends(get_current_admin)
):
    db = get_database()
    prod_id = f"prod_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    
    doc = {
        "_id": prod_id,
        "name": product_in.name,
        "description": product_in.description,
        "price": product_in.price,
        "category": product_in.category,
        "image": product_in.image,
        "stock": product_in.stock,
        "is_available": product_in.is_available,
        "created_at": now
    }
    
    await db.products.insert_one(doc)
    
    return ProductOut(
        id=prod_id,
        name=doc["name"],
        description=doc["description"],
        price=doc["price"],
        category=doc["category"],
        image=doc["image"],
        stock=doc["stock"],
        is_available=doc["is_available"],
        created_at=now
    )

@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    product_in: ProductUpdate,
    admin: dict = Depends(get_current_admin)
):
    db = get_database()
    existing = await db.products.find_one({"_id": product_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found."
        )

    update_data = {k: v for k, v in product_in.model_dump().items() if v is not None}
    
    if update_data:
        await db.products.update_one({"_id": product_id}, {"$set": update_data})

    updated_doc = await db.products.find_one({"_id": product_id})
    return ProductOut(
        id=str(updated_doc["_id"]),
        name=updated_doc["name"],
        description=updated_doc["description"],
        price=updated_doc["price"],
        category=updated_doc["category"],
        image=updated_doc["image"],
        stock=updated_doc["stock"],
        is_available=updated_doc.get("is_available", True),
        created_at=updated_doc["created_at"]
    )

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(
    product_id: str,
    admin: dict = Depends(get_current_admin)
):
    db = get_database()
    result = await db.products.delete_one({"_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found."
        )
    return {"message": f"Product '{product_id}' deleted successfully"}
