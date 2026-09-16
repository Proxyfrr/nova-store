from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
import uuid
from database import get_database
from models.user import UserRegister, UserLogin, TokenResponse, UserOut
from utils.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister):
    db = get_database()
    existing_user = await db.users.find_one({"email": user_in.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = f"user_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    
    user_doc = {
        "_id": user_id,
        "name": user_in.name,
        "email": user_in.email.lower(),
        "password_hash": hash_password(user_in.password),
        "role": "customer",
        "created_at": now
    }
    
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user_id, "role": "customer"})
    
    user_payload = {
        "id": user_id,
        "name": user_in.name,
        "email": user_in.email.lower(),
        "role": "customer",
        "created_at": now.isoformat()
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_payload
    }

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_database()
    user = await db.users.find_one({"email": credentials.email.lower()})
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_id = str(user["_id"])
    role = user.get("role", "customer")
    access_token = create_access_token(data={"sub": user_id, "role": role})

    user_payload = {
        "id": user_id,
        "name": user["name"],
        "email": user["email"],
        "role": role,
        "created_at": user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else user["created_at"]
    }

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_payload
    }

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        role=current_user.get("role", "customer"),
        created_at=current_user["created_at"]
    )
