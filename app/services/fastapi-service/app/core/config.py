from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "FastAPI Expense Service"
    VERSION: str = "1.0.0"
    PORT: int = 3003
    
    # Database
    DB_HOST: str = "postgres"
    DB_PORT: int = 5432
    POSTGRES_USER: str = "testuser"
    POSTGRES_PASSWORD: str = "testpass"
    POSTGRES_DB: str = "testdb"
    
    # JWT
    JWT_SECRET: str = "your-jwt-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:80",
        "http://frontend:3000"
    ]
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.POSTGRES_DB}"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
