from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import health, expenses

app = FastAPI(
    title="FastAPI Expense Service",
    description="FastAPI-based microservice for expense management",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])

@app.get("/")
async def root():
    return {
        "service": "FastAPI Expense Service",
        "version": "1.0.0",
        "docs": "/api/docs"
    }
