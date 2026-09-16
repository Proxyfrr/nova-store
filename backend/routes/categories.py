from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timezone
import re
import uuid
from database import get_database
from models.category import CategoryCreate, CategoryUpdate, CategoryOut
from utils.auth import get_current_admin

router = APIRouter(prefix="/api/categories", tags=["Categories"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[\s_-]+', '-', text)

@router.get("", response_model=List[CategoryOut])
async def get_categories():
    db = get_database()
    cursor = db.categories.find().sort("name", 1)
    categories = []
    async for doc in cursor:
        categories.append(CategoryOut(
            id=str(doc["_id"]),
            name=doc["name"],
            slug=doc.get("slug", slugify(doc["name"])),
            description=doc.get("description", ""),
            image=doc.get("image", ""),
            created_at=doc.get("created_at", datetime.now(timezone.utc))
        ))
    return categories

@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(
    cat_in: CategoryCreate,
    admin: dict = Depends(get_current_admin)
):
    db = get_database()
    slug = slugify(cat_in.name)
    
    existing = await db.categories.find_one({"$or": [{"name": cat_in.name}, {"slug": slug}]})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A category with this name already exists."
        )

    cat_id = f"cat_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    
    doc = {
        "_id": cat_id,
        "name": cat_in.name,
        "slug": slug,
        "description": cat_in.description or "",
        "image": cat_in.image or "",
        "created_at": now
    }
    
    await db.categories.insert_one(doc)
    
    return CategoryOut(
        id=cat_id,
        name=doc["name"],
        slug=doc["slug"],
        description=doc["description"],
        image=doc["image"],
        created_at=now
    )

@router.put("/{cat_id}", response_model=CategoryOut)
async def update_category(
    cat_id: str,
    cat_in: CategoryUpdate,
    admin: dict = Depends(get_current_admin)
):
    db = get_database()
    existing = await db.categories.find_one({"_id": cat_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{cat_id}' not found."
        )

    update_data = {}
    if cat_in.name is not None:
        update_data["name"] = cat_in.name
        update_data["slug"] = slugify(cat_in.name)
    if cat_in.description is not None:
        update_data["description"] = cat_in.description
    if cat_in.image is not None:
        update_data["image"] = cat_in.image

    if update_data:
        await db.categories.update_one({"_id": cat_id}, {"$set": update_data})

    updated_doc = await db.categories.find_one({"_id": cat_id})
    return CategoryOut(
        id=str(updated_doc["_id"]),
        name=updated_doc["name"],
        slug=updated_doc.get("slug", slugify(updated_doc["name"])),
        description=updated_doc.get("description", ""),
        image=updated_doc.get("image", ""),
        created_at=updated_doc.get("created_at", datetime.now(timezone.utc))
    )

@router.delete("/{cat_id}", status_code=status.HTTP_200_OK)
async def delete_category(
    cat_id: str,
    admin: dict = Depends(get_current_admin)
):
    db = get_database()
    result = await db.categories.delete_one({"_id": cat_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{cat_id}' not found."
        )
    return {"message": f"Category '{cat_id}' deleted successfully"}
