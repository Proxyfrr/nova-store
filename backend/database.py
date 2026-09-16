import logging
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

logger = logging.getLogger("nova_store.database")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_instance.db = db_instance.client[settings.DB_NAME]
    
    # Create indexes asynchronously for optimal query performance
    try:
        await db_instance.db.users.create_index("email", unique=True)
        await db_instance.db.products.create_index("category")
        await db_instance.db.products.create_index("is_available")
        await db_instance.db.categories.create_index("slug", unique=True)
        await db_instance.db.orders.create_index("customer_id")
        await db_instance.db.orders.create_index("status")
        await db_instance.db.orders.create_index("created_at")
        logger.info("MongoDB indexes verified/created successfully.")
    except Exception as e:
        logger.warning(f"Note on index creation: {e}")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    return db_instance.db
