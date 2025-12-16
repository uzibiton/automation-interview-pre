import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test root endpoint returns service information"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "FastAPI Expense Service"
    assert data["version"] == "1.0.0"
    assert data["docs"] == "/api/docs"


@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/health")
    
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["service"] == "fastapi-service"
