from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, users, products, categories, brands, orders, cart

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cyna E-Commerce API",
    description="API for Cyna E-Commerce platform",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost:8000",  # Development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(brands.router, prefix="/brands", tags=["Brands"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])

@app.get("/")
async def root():
    return {"message": "Welcome to Cyna E-Commerce API"} 