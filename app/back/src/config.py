from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/cyna_ecommerce")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # Clé secrète pour la création d'admin, doit être définie dans .env
    ADMIN_SETUP_KEY: str = os.getenv("ADMIN_SETUP_KEY", "")

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings() 