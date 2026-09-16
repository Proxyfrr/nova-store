import asyncio
import logging
from datetime import datetime, timezone
import uuid
from database import get_database, connect_to_mongo, close_mongo_connection
from utils.auth import hash_password

logger = logging.getLogger("nova_store.seed")

DEFAULT_CATEGORIES = [
    {
        "_id": "cat_outerwear",
        "name": "Outerwear",
        "slug": "outerwear",
        "description": "Premium coats, structured blazers, and luxury jackets designed for all seasons.",
        "image": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "cat_tops",
        "name": "Tops & Tees",
        "slug": "tops-tees",
        "description": "Essential organic cotton shirts, silk blouses, and minimal luxury tees.",
        "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "cat_pants",
        "name": "Pants & Denim",
        "slug": "pants-denim",
        "description": "Tailored trousers, raw Japanese denim, and relaxed linen trousers.",
        "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "cat_footwear",
        "name": "Footwear",
        "slug": "footwear",
        "description": "Italian leather Chelsea boots, handcrafted sneakers, and modern loafers.",
        "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "cat_accessories",
        "name": "Accessories",
        "slug": "accessories",
        "description": "Minimalist leather bags, cashmere scarves, and signature sunglasses.",
        "image": "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80",
        "created_at": datetime.now(timezone.utc)
    }
]

DEFAULT_PRODUCTS = [
    {
        "_id": "prod_101",
        "name": "Minimalist Wool Trench Coat",
        "description": "Tailored double-breasted coat crafted from 100% Australian Merino wool. Soft lining, storm flap, and adjustable belt.",
        "price": 289.00,
        "category": "Outerwear",
        "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80",
        "stock": 18,
        "is_available": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "prod_102",
        "name": "Heavyweight Oversized Tee",
        "description": "280 GSM combed organic cotton t-shirt with dropped shoulders and a dense ribbed collar for a structured boxy silhouette.",
        "price": 48.00,
        "category": "Tops & Tees",
        "image": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
        "stock": 45,
        "is_available": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "prod_103",
        "name": "Japanese Selvedge Denim Jeans",
        "description": "14oz raw selvedge denim woven in Kurashiki, Japan. Features custom silver hardware and a timeless straight leg cut.",
        "price": 165.00,
        "category": "Pants & Denim",
        "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
        "stock": 24,
        "is_available": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "prod_104",
        "name": "Artisanal Leather Chelsea Boots",
        "description": "Full-grain Tuscan calfskin leather boots with durable Goodyear welted construction and stacked rubber soles.",
        "price": 240.00,
        "category": "Footwear",
        "image": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
        "stock": 12,
        "is_available": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "prod_105",
        "name": "Structure Leather Tote Bag",
        "description": "Sleek architectural weekend bag cut from vegetable-tanned leather. Includes laptop compartment and matte black hardware.",
        "price": 195.00,
        "category": "Accessories",
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
        "stock": 15,
        "is_available": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "prod_106",
        "name": "Cashmere Knit Sweater",
        "description": "Ultra-soft 100% Mongolian cashmere crewneck sweater. Ribbed cuffs and hem with lightweight insulating luxury warmth.",
        "price": 175.00,
        "category": "Tops & Tees",
        "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
        "stock": 30,
        "is_available": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "prod_107",
        "name": "Relaxed Pleated Trousers",
        "description": "High-waisted trousers with front double pleats, elastic waistband detailing, and a smooth drape in Italian wool blend.",
        "price": 130.00,
        "category": "Pants & Denim",
        "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
        "stock": 20,
        "is_available": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "_id": "prod_108",
        "name": "Cropped Suede Puffer Jacket",
        "description": "Insulated duck-down jacket wrapped in water-repellent faux suede. Deep fleece-lined side pockets and drawstring waist.",
        "price": 220.00,
        "category": "Outerwear",
        "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
        "stock": 8,
        "is_available": True,
        "created_at": datetime.now(timezone.utc)
    }
]

async def seed_data():
    db = get_database()
    
    # 1. Seed Categories
    for cat in DEFAULT_CATEGORIES:
        await db.categories.update_one(
            {"_id": cat["_id"]},
            {"$setOnInsert": cat},
            upsert=True
        )
    logger.info("Categories seeded.")

    # 2. Seed Products
    for prod in DEFAULT_PRODUCTS:
        await db.products.update_one(
            {"_id": prod["_id"]},
            {"$setOnInsert": prod},
            upsert=True
        )
    logger.info("Products seeded.")

    # 3. Seed Admin User
    admin_email = "admin@novastore.com"
    existing_admin = await db.users.find_one({"email": admin_email})
    if not existing_admin:
        admin_doc = {
            "_id": "user_admin_001",
            "name": "System Administrator",
            "email": admin_email,
            "password_hash": hash_password("adminpassword123"),
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(admin_doc)
        logger.info("Default Admin account created: admin@novastore.com / adminpassword123")

    # 4. Seed Test Customer User
    customer_email = "customer@novastore.com"
    existing_customer = await db.users.find_one({"email": customer_email})
    if not existing_customer:
        customer_doc = {
            "_id": "user_customer_001",
            "name": "Alex Mercer",
            "email": customer_email,
            "password_hash": hash_password("customerpassword123"),
            "role": "customer",
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(customer_doc)
        logger.info("Default Customer account created: customer@novastore.com / customerpassword123")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    async def main():
        await connect_to_mongo()
        await seed_data()
        await close_mongo_connection()
    asyncio.run(main())
