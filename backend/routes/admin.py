from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from datetime import datetime
from database import get_database
from models.order import OrderOut, OrderItemOut, OrderStatusUpdate
from models.user import UserOut
from utils.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/orders", response_model=List[OrderOut])
async def get_all_orders(
    status_filter: Optional[str] = Query(None, alias="status"),
    admin: dict = Depends(get_current_admin)
):
    db = get_database()
    query = {}
    if status_filter and status_filter.lower() != "all":
        query["status"] = status_filter

    cursor = db.orders.find(query).sort("created_at", -1)
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

@router.put("/orders/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: str,
    status_in: OrderStatusUpdate,
    admin: dict = Depends(get_current_admin)
):
    db = get_database()
    query = {"$or": [{"_id": order_id}, {"order_id": order_id}]}
    
    order = await db.orders.find_one(query)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_id}' not found."
        )

    await db.orders.update_one(query, {"$set": {"status": status_in.status}})
    
    updated_doc = await db.orders.find_one(query)
    return OrderOut(
        id=str(updated_doc["_id"]),
        order_id=updated_doc["order_id"],
        customer_id=updated_doc["customer_id"],
        customer_name=updated_doc["customer_name"],
        customer_email=updated_doc["customer_email"],
        customer_phone=updated_doc["customer_phone"],
        customer_address=updated_doc["customer_address"],
        items=[OrderItemOut(**item) for item in updated_doc["items"]],
        subtotal=updated_doc["subtotal"],
        tax=updated_doc["tax"],
        total=updated_doc["total"],
        status=updated_doc["status"],
        created_at=updated_doc["created_at"]
    )

@router.get("/users", response_model=List[UserOut])
async def get_registered_customers(admin: dict = Depends(get_current_admin)):
    db = get_database()
    cursor = db.users.find({"role": "customer"}).sort("created_at", -1)
    users = []
    async for doc in cursor:
        users.append(UserOut(
            id=str(doc["_id"]),
            name=doc["name"],
            email=doc["email"],
            role=doc.get("role", "customer"),
            created_at=doc["created_at"]
        ))
    return users

@router.get("/stats")
async def get_dashboard_stats(admin: dict = Depends(get_current_admin)):
    db = get_database()
    
    # 1. Total products count
    total_products = await db.products.count_documents({})
    
    # 2. Total registered customers count
    total_customers = await db.users.count_documents({"role": "customer"})
    
    # 3. Total orders count
    total_orders = await db.orders.count_documents({})
    
    # 4. Pending orders count
    pending_orders = await db.orders.count_documents({"status": "Pending"})
    
    # 5. Total revenue calculated from MongoDB non-cancelled orders
    pipeline = [
        {"$match": {"status": {"$ne": "Cancelled"}}},
        {"$group": {"_id": None, "revenue": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(length=1)
    total_revenue = round(revenue_result[0]["revenue"], 2) if revenue_result else 0.0

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_revenue": total_revenue
    }
