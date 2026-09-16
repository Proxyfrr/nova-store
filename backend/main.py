import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import connect_to_mongo, close_mongo_connection
from seed import seed_data
from routes import auth, products, categories, orders, admin

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("nova_store")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Initializing NOVA STORE backend service...")
    await connect_to_mongo()
    await seed_data()
    logger.info("NOVA STORE backend ready for traffic.")
    yield
    # Shutdown actions
    logger.info("Shutting down NOVA STORE backend service...")
    await close_mongo_connection()

app = FastAPI(
    title="NOVA STORE REST API",
    description="Full-stack e-commerce API for NOVA STORE clothing and lifestyle brand.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(orders.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {
        "app": "NOVA STORE API",
        "status": "online",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=int(os.environ.get("PORT", 8000))
)
