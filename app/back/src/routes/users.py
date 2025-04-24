from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List
from ..database import get_db
from ..models.models import User, Order, CartItem, DeletionLog
from ..schemas.schemas import UserCreate, User as UserSchema, UserUpdate, Order as OrderSchema, UserDataExport
from ..security import get_current_user, get_password_hash, check_admin_user
from datetime import datetime, timedelta

router = APIRouter()

# --- Helper Functions for Anonymization/Deletion ---

def _anonymize_user_orders(user_id: int, db: Session):
    """Anonymise les commandes d'un utilisateur.
    Met user_id à None et remplace shipping_address.
    """
    orders_to_anonymize = db.query(Order).filter(Order.user_id == user_id).all()
    if orders_to_anonymize:
        for order in orders_to_anonymize:
            order.user_id = None
            order.shipping_address = "Anonymized Address"
        # Note: Flush might be useful here if we want subsequent operations
        # in the same transaction to see these changes before commit.
        # For now, commit at the end handles it.
        # db.flush()

def _delete_user_cart_items(user_id: int, db: Session):
    """Supprime les éléments du panier d'un utilisateur."""
    cart_items_to_delete = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if cart_items_to_delete:
        for item in cart_items_to_delete:
            db.delete(item)
        # db.flush()

def _log_user_deletion(user_id: int, db: Session):
    """Journalise la suppression d'un utilisateur."""
    log_entry = DeletionLog(user_id=user_id, deleted_at=datetime.utcnow())
    db.add(log_entry)
    # db.flush()

# --- Original Routes --- 

@router.get("/", response_model=List[UserSchema])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère la liste des utilisateurs.
    Seuls les administrateurs peuvent voir tous les utilisateurs.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les administrateurs peuvent voir la liste des utilisateurs"
        )
    users = db.query(User).options(joinedload(User.orders), joinedload(User.cart_items)).offset(skip).limit(limit).all()
    return users

@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Récupère les informations de l'utilisateur connecté.
    """
    return current_user

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère un utilisateur par son ID.
    Seuls les administrateurs ou l'utilisateur lui-même peuvent voir ses informations.
    """
    user = db.query(User).options(joinedload(User.orders), joinedload(User.cart_items)).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas la permission de voir cet utilisateur"
        )
    return user

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Met à jour les informations d'un utilisateur.
    Seuls les administrateurs ou l'utilisateur lui-même peuvent modifier ses informations.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas la permission de modifier cet utilisateur"
        )

    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Supprime un utilisateur.
    Seuls les administrateurs peuvent supprimer des utilisateurs.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les administrateurs peuvent supprimer des utilisateurs"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    db.delete(user)
    db.commit()
    return {"status": "success"}

# --- RGPD Routes --- 

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permet à l'utilisateur connecté de supprimer son propre compte (Droit à l'effacement RGPD).
    Anonymise les commandes, supprime le panier, journalise, puis supprime l'utilisateur.
    """
    user_id_to_delete = current_user.id
    db_user = db.query(User).filter(User.id == user_id_to_delete).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")

    # Utilisation des fonctions helper
    _anonymize_user_orders(user_id_to_delete, db)
    _delete_user_cart_items(user_id_to_delete, db)
    
    # Supprimer l'utilisateur lui-même
    db.delete(db_user)

    # Journaliser AVANT commit final (pour inclure dans la même transaction)
    _log_user_deletion(user_id_to_delete, db)

    # Commiter toutes les opérations
    db.commit()
    # Statut 204 ne retourne pas de corps

@router.get("/me/export", response_model=UserDataExport)
async def export_current_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permet à l'utilisateur connecté d'exporter ses données personnelles (Droit à la portabilité RGPD).
    Retourne les données de l'utilisateur et l'historique de ses commandes non anonymisées.
    """
    # Re-fetch user with orders eagerly loaded to ensure they are available
    # Use selectinload for better performance with lists of related objects
    user_with_data = db.query(User).options(
        selectinload(User.orders).selectinload(Order.items) # Load orders and their items
    ).filter(User.id == current_user.id).first()

    if not user_with_data:
        # Should not happen with a valid token, but check anyway
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # The UserDataExport schema will automatically include the orders
    # Pydantic handles the conversion from the SQLAlchemy model instance
    return user_with_data

# --- Route Admin pour Purge Manuelle ---

@router.post("/purge-inactive", status_code=status.HTTP_200_OK)
async def purge_inactive_users(
    inactive_days: int = 365, # Durée d'inactivité en jours
    db: Session = Depends(get_db),
    current_admin: User = Depends(check_admin_user) # Vérifie que l'utilisateur est admin
):
    """
    [ADMIN ONLY] Déclenche manuellement la suppression/anonymisation
    des utilisateurs considérés comme inactifs.
    ATTENTION: Ceci est une démonstration. Une tâche planifiée est nécessaire pour l'automatisation.
    """
    cutoff_date = datetime.utcnow() - timedelta(days=inactive_days)
    
    # Trouve les utilisateurs inactifs (jamais connectés ou dernière connexion avant la date limite)
    # Exclut les admins pour éviter l'auto-suppression
    inactive_users = db.query(User).filter(
        User.role != 'admin',
        (User.last_login_at == None) | (User.last_login_at < cutoff_date)
    ).all()

    purged_count = 0
    errors = []

    for user in inactive_users:
        user_id_to_purge = user.id
        print(f"Purging inactive user ID: {user_id_to_purge}") # Log simple
        try:
            # Applique la même logique que delete_me
            _anonymize_user_orders(user_id_to_purge, db)
            _delete_user_cart_items(user_id_to_purge, db)
            db.delete(user) # Supprime l'objet User SQLAlchemy
            _log_user_deletion(user_id_to_purge, db)
            # Le commit se fera à la fin pour toutes les purges réussies
            purged_count += 1
        except Exception as e:
            # Log l'erreur et continue avec les autres utilisateurs
            db.rollback() # Annule les changements pour CET utilisateur
            print(f"Error purging user ID {user_id_to_purge}: {e}")
            errors.append({"user_id": user_id_to_purge, "error": str(e)})
            # Re-ouvre une transaction si nécessaire (selon la gestion de session)
            # Si on utilise le pattern try/finally pour db.close() dans get_db,
            # une nouvelle session sera fournie implicitement à la prochaine itération.
            # Il est crucial de ne pas laisser la session dans un état invalide.
            # On pourrait re-créer une session ici si nécessaire, mais le rollback 
            # suivi du commit global est généralement suffisant avec FastAPI Depends.


    if purged_count > 0:
        try:
            db.commit() # Commit toutes les purges réussies
        except Exception as e:
            # Erreur lors du commit final (rare mais possible)
             print(f"Final commit error after purging {purged_count} users: {e}")
             # Il faudrait une stratégie de reprise ou un log plus détaillé ici
             errors.append({"user_id": "COMMIT_FAILED", "error": str(e)})
             purged_count = 0 # Réfléchir si on considère qu'aucune purge n'a eu lieu

    return {
        "message": f"Purge attempt finished. {purged_count} inactive users processed.",
        "errors": errors
    }

# --- Fin de la route Admin ---

# --- Fin des nouvelles routes RGPD --- 