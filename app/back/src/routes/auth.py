from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import Any, Optional

from ..database import get_db
from ..schemas.schemas import Token, UserCreate, User
from ..models.models import User as UserModel
from ..security import authenticate_user, create_access_token, get_password_hash
from ..config import get_settings

settings = get_settings()
router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Mise à jour de last_login_at
    user.last_login_at = datetime.utcnow()
    db.add(user) # Add user to session to track changes
    db.commit()  # Commit the last_login_at update
    # db.refresh(user) # Optional: refresh if you need the updated user object immediately

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=User)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    x_admin_key: Optional[str] = Header(None)
) -> Any:
    """
    Inscription d'un nouvel utilisateur.
    Si x_admin_key est fourni et valide, l'utilisateur sera créé en tant qu'admin.
    """
    # Check if user already exists
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Détermine si l'utilisateur doit être un admin
    role = "customer"
    if x_admin_key and settings.ADMIN_SETUP_KEY and x_admin_key == settings.ADMIN_SETUP_KEY:
        role = "admin"
    
    # Create new user
    db_user = UserModel(
        email=user.email,
        full_name=user.full_name,
        password_hash=get_password_hash(user.password),
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/_hidden_setup_admin", response_model=User, include_in_schema=False)
async def create_admin_user(
    db: Session = Depends(get_db),
    x_admin_key: Optional[str] = Header(None)
) -> Any:
    """
    Route cachée pour créer un utilisateur admin par défaut.
    Nécessite une clé d'API spéciale dans le header X-Admin-Key.
    Cette route n'apparaît pas dans la documentation Swagger.
    """
    # Vérifie la clé d'API
    if not settings.ADMIN_SETUP_KEY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="La création d'admin n'est pas configurée"
        )
    
    if not x_admin_key or x_admin_key != settings.ADMIN_SETUP_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Clé d'administration invalide"
        )
    
    # Crée l'utilisateur admin par défaut
    admin_user = UserModel(
        email="admin@example.com",
        full_name="Admin User",
        password_hash=get_password_hash("admin12345"),
        role="admin"
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    return admin_user 