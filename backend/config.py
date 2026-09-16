import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")
    DB_NAME: str = os.getenv("DB_NAME", "nova_store_db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-nova-store-jwt-key-2026-secure-production-ready")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
