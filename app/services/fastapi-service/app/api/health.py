from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter()


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint - verifies service and database connectivity
    """
    try:
        # Test database connection
        result = await db.execute(text("SELECT 1"))
        result.scalar()
        
        return {
            "status": "healthy",
            "service": "fastapi-service",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "fastapi-service",
            "database": "disconnected",
            "error": str(e)
        }
