# app/back/src/routes/consent.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.models import ConsentLog as ConsentLogModel, User
from ..schemas.schemas import ConsentLog, ConsentLogCreate
from ..security import get_current_active_user
from datetime import datetime

router = APIRouter(
    prefix="/users/me/consents",
    tags=["Consent Management"]
)

@router.post("/", response_model=ConsentLog, status_code=status.HTTP_201_CREATED)
def record_consent(
    consent_data: ConsentLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Enregistre une décision de consentement (ou le retrait) pour l'utilisateur connecté.
    """
    db_consent = ConsentLogModel(
        user_id=current_user.id,
        consent_type=consent_data.consent_type,
        granted=consent_data.granted,
        timestamp=datetime.utcnow() # Assurer l'horodatage côté serveur
    )
    db.add(db_consent)
    db.commit()
    db.refresh(db_consent)
    return db_consent

@router.get("/", response_model=List[ConsentLog])
def get_consent_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    consent_type: Optional[str] = None # Optional filter by type
):
    """
    Récupère l'historique des consentements pour l'utilisateur connecté.
    Peut être filtré par type de consentement.
    """
    query = db.query(ConsentLogModel).filter(ConsentLogModel.user_id == current_user.id)
    if consent_type:
        query = query.filter(ConsentLogModel.consent_type == consent_type)
    
    # Order by timestamp, newest first perhaps?
    consent_history = query.order_by(ConsentLogModel.timestamp.desc()).all()
    return consent_history 