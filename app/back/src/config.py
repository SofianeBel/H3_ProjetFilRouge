from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Explicitly load with UTF-8 encoding
load_dotenv(encoding='utf-8')

class Settings(BaseSettings):
    # Chaîne de connexion codée en dur pour éviter les problèmes d'encodage
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:kuzan45+@localhost:5432/ecom")
    # Autres paramètres lus depuis .env
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