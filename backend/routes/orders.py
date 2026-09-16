from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timezone
import uuid
import random
from database import get_database
from models.order import OrderCreate, OrderOut, OrderItemOut
from utils.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])

def generate_order_id() -> str:
    rand_part = ''.join(random.choices('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', k=6))
    return f"ORD-{rand_part}"

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    customer_id = str(current_user["_id"])
    
    order_items_out: List[OrderItemOut] = []
    subtotal = 0.0
    
    # 1. Fetch real products from MongoDB and validate stock & calculate prices
    for item in order_in.items:
        product_doc = await db.products.find_one({"_id": item.product_id})
        if not product_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID '{item.product_id}' was not found in catalog."
            )
            
        if not product_doc.get("is_available", True):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product '{product_doc['name']}' is currently unavailable for purchase."
            )
            
        current_stock = product_doc.get("stock", 0)
        if current_stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product_doc['name']}'. Requested: {item.quantity}, Available: {current_stock}."
            )
            
        real_price = float(product_doc["price"])
        item_total = round(real_price * item.quantity, 2)
        subtotal += item_total
        
        order_items_out.append(OrderItemOut(
            product_id=str(product_doc["_id"]),
            name=product_doc["name"],
            price=real_price,
            image=product_doc.get("image", ""),
            quantity=item.quantity,
            total_price=item_total
        ))

    subtotal = round(subtotal, 2)
    tax = round(subtotal * 0.10, 2)  # 10% tax rate
    total = round(subtotal + tax, 2)
    
    order_doc_id = f"order_{uuid.uuid4().hex[:12]}"
    readable_order_id = generate_order_id()
    now = datetime.now(timezone.utc)

    # 2. Build Order Document
    order_doc = {
        "_id": order_doc_id,
        "order_id": readable_order_id,
        "customer_id": customer_id,
        "customer_name": order_in.customer_name,
        "customer_email": order_in.customer_email.lower(),
        "customer_phone": order_in.customer_phone,
        "customer_address": order_in.customer_address,
        "items": [item.model_dump() for item in order_items_out],
        "subtotal": subtotal,
        "tax": tax,
        "total": total,
        "status": "Pending",
        "created_at": now
    }

    # 3. Save order to MongoDB
    await db.orders.insert_one(order_doc)

    # 4. Decrease product stock in MongoDB for each ordered item
    for item in order_items_out:
        await db.products.update_one(
            {"_id": item.product_id},
            {"$inc": {"stock": -item.quantity}}
        )

    return OrderOut(
        id=order_doc_id,
        order_id=readable_order_id,
        customer_id=customer_id,
        customer_name=order_doc["customer_name"],
        customer_email=order_doc["customer_email"],
        customer_phone=order_doc["customer_phone"],
        customer_address=order_doc["customer_address"],
        items=order_items_out,
        subtotal=subtotal,
        tax=tax,
        total=total,
        status="Pending",
        created_at=now
    )

@router.get("", response_model=List[OrderOut])
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    db = get_database()
    customer_id = str(current_user["_id"])
    
    cursor = db.orders.find({"customer_id": customer_id}).sort("created_at", -1)
    orders = []
    async for doc in cursor:
        orders.append(OrderOut(
            id=str(doc["_id"]),
            order_id=doc["order_id"],
            customer_id=doc["customer_id"],
            customer_name=doc["customer_name"],
            customer_email=doc["customer_email"],
            customer_phone=doc["customer_phone"],
            customer_address=doc["customer_address"],
            items=[OrderItemOut(**item) for item in doc["items"]],
            subtotal=doc["subtotal"],
            tax=doc["tax"],
            total=doc["total"],
            status=doc["status"],
            created_at=doc["created_at"]
        ))
    return orders

@router.get("/{order_id}", response_model=OrderOut)
async def get_order_detail(order_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    customer_id = str(current_user["_id"])
    role = current_user.get("role", "customer")
    
    # Can query by database _id or readable order_id
    query = {"$or": [{"_id": order_id}, {"order_id": order_id}]}
    if role != "admin":
        query["customer_id"] = customer_id

    doc = await db.orders.find_one(query)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_id}' not found."
        )

    return OrderOut(
        id=str(doc["_id"]),
        order_id=doc["order_id"],
        customer_id=doc["customer_id"],
        customer_name=doc["customer_name"],
        customer_email=doc["customer_email"],
        customer_phone=doc["customer_phone"],
        customer_address=doc["customer_address"],
        items=[OrderItemOut(**item) for item in doc["items"]],
        subtotal=doc["subtotal"],
        tax=doc["tax"],
        total=doc["total"],
        status=doc["status"],
        created_at=doc["created_at"]
    )
