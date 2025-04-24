from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List, Optional
from ..database import get_db
from ..models.models import User, Order, CartItem, DeletionLog, OrderItem, Payment, ArchivedOrder, ArchivedOrderItem, ArchivedPayment
from ..schemas.schemas import UserCreate, User as UserSchema, UserUpdate, Order as OrderSchema, UserDataExport
from ..security import get_current_user, get_password_hash, check_admin_user
from datetime import datetime, timedelta
from fastapi.responses import StreamingResponse
import io
import csv
from fpdf import FPDF

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

# --- Fonction d'archivage/suppression (peut être partagée avec le script via un module utils?) ---
# Pour l'instant, on duplique la logique ici pour la route admin.
# Une meilleure approche serait de mettre cette logique dans un module séparé.
def _archive_and_delete_user_data_for_route(user_id: int, db: Session):
    """Duplication de la logique d'archivage pour utilisation par la route admin."""
    # Identique à la fonction dans le script purge_inactive_script.py
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    archived_count = 0
    for order in orders:
        archived_order = ArchivedOrder(
            id=order.id, original_user_id=order.user_id, order_date=order.order_date,
            status=order.status, total_amount=order.total_amount,
            shipping_address="Anonymized Address", created_at=order.created_at,
            updated_at=order.updated_at
        )
        db.add(archived_order)
        for item in order.items:
            archived_item = ArchivedOrderItem(
                id=item.id, order_id=archived_order.id, product_id=item.product_id,
                quantity=item.quantity, unit_price=item.unit_price
            )
            db.add(archived_item)
            db.delete(item)
        for payment in order.payments:
             archived_payment = ArchivedPayment(
                 id=payment.id, order_id=archived_order.id, payment_date=payment.payment_date,
                 payment_method=payment.payment_method, status=payment.status,
                 amount=payment.amount, transaction_id=payment.transaction_id
             )
             db.add(archived_payment)
             db.delete(payment)
        db.delete(order)
        archived_count += 1
    cart_items_to_delete = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if cart_items_to_delete:
        for item in cart_items_to_delete:
            db.delete(item)
    # Note: le commit se fait dans la fonction appelante (purge_inactive_users)

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

@router.get(
    "/me/export",
    summary="Export User Data",
    description="Permet à l'utilisateur connecté d'exporter ses données personnelles (Droit à la portabilité RGPD). "
                "Retourne les données au format JSON (défaut), PDF ou CSV selon le paramètre 'format'.",
    responses={
        200: {
            "description": "Données utilisateur exportées avec succès dans le format demandé.",
            "content": {
                "application/json": {
                    "schema": UserDataExport.model_json_schema(), 
                    "example": {"id": 1, "full_name": "Example User", "email": "user@example.com", "role": "customer", "created_at": "...", "updated_at": "...", "last_login_at": "...", "orders": []}
                },
                "application/pdf": {
                    "schema": {"type": "string", "format": "binary"},
                    "description": "Fichier PDF contenant les données utilisateur."
                },
                "text/csv": {
                    "schema": {"type": "string"},
                    "description": "Fichier CSV contenant les données utilisateur."
                 }
            }
        },
        404: {"description": "Utilisateur non trouvé"},
        400: {"description": "Format invalide spécifié"}
    }
)
def export_current_user_data(
    format: Optional[str] = Query("json", enum=["json", "pdf", "csv"], description="Le format souhaité pour l'export (json, pdf, ou csv)."),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permet à l'utilisateur connecté d'exporter ses données personnelles (Droit à la portabilité RGPD).
    Retourne les données au format JSON (défaut), PDF ou CSV.
    """
    user_with_data = db.query(User).options(
        selectinload(User.orders).selectinload(Order.items)
    ).filter(User.id == current_user.id).first()

    if not user_with_data:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Nom de fichier suggéré
    filename = f"export_data_{user_with_data.id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

    # --- Génération JSON (défaut) ---
    if format == "json":
        # Utilise le schéma Pydantic pour sérialiser
        export_data = UserDataExport.from_orm(user_with_data)
        return export_data # FastAPI gère la sérialisation JSON

    # --- Génération CSV --- 
    elif format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)

        # Écrire les infos utilisateur
        writer.writerow(['User ID', user_with_data.id])
        writer.writerow(['Full Name', user_with_data.full_name])
        writer.writerow(['Email', user_with_data.email])
        writer.writerow(['Role', user_with_data.role])
        writer.writerow(['Created At', user_with_data.created_at.isoformat()])
        writer.writerow(['Updated At', user_with_data.updated_at.isoformat()])
        writer.writerow(['Last Login At', user_with_data.last_login_at.isoformat() if user_with_data.last_login_at else 'N/A'])
        writer.writerow([]) # Ligne vide
        writer.writerow(['Orders'])

        # Écrire les en-têtes des commandes
        writer.writerow(['Order ID', 'Order Date', 'Status', 'Total Amount', 'Shipping Address', 'Item Product ID', 'Item Name', 'Item Quantity', 'Item Unit Price'])

        # Écrire les données des commandes et items
        for order in user_with_data.orders:
            first_item = True
            if not order.items:
                writer.writerow([
                    order.id, order.order_date.isoformat(), order.status, str(order.total_amount), order.shipping_address,
                    'N/A', 'N/A', 'N/A', 'N/A'
                ])
            else:
                for item in order.items:
                    # Récupérer le nom du produit (si la relation est chargée ou via une requête)
                    # Ici, on suppose que l'objet Product n'est pas chargé, on met N/A
                    # Pour l'avoir, il faudrait charger item.product dans la requête initiale ou faire une sous-requête.
                    product_name = "N/A" # Simplification
                    if first_item:
                        writer.writerow([
                            order.id, order.order_date.isoformat(), order.status, str(order.total_amount), order.shipping_address,
                            item.product_id, product_name, item.quantity, str(item.unit_price)
                        ])
                        first_item = False
                    else:
                        writer.writerow([
                            '', '', '', '', '',
                            item.product_id, product_name, item.quantity, str(item.unit_price)
                        ])

        output.seek(0)
        headers = {'Content-Disposition': f'attachment; filename="{filename}.csv"'}
        return StreamingResponse(output, media_type="text/csv", headers=headers)

    # --- Génération PDF --- 
    elif format == "pdf":
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        # Infos Utilisateur
        pdf.cell(200, 10, txt="User Data Export", ln=True, align='C')
        pdf.ln(5)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(40, 10, txt="User ID:")
        pdf.set_font("Arial", size=10)
        pdf.cell(0, 10, txt=str(user_with_data.id), ln=True)
        # ... (ajouter les autres champs utilisateur: full_name, email, role, dates...)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(40, 10, txt="Full Name:")
        pdf.set_font("Arial", size=10)
        pdf.cell(0, 10, txt=user_with_data.full_name, ln=True)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(40, 10, txt="Email:")
        pdf.set_font("Arial", size=10)
        pdf.cell(0, 10, txt=user_with_data.email, ln=True)
        # ... (ajouter les autres champs)

        pdf.ln(10)
        pdf.set_font("Arial", 'B', size=12)
        pdf.cell(0, 10, txt="Orders", ln=True)
        pdf.ln(5)

        # Tableau des Commandes
        pdf.set_font("Arial", 'B', size=8)
        col_widths = [15, 35, 20, 25, 50] # Ajuster les largeurs
        headers = ['Order ID', 'Date', 'Status', 'Total', 'Shipping Address']
        for i, header in enumerate(headers):
            pdf.cell(col_widths[i], 10, txt=header, border=1)
        pdf.ln()

        pdf.set_font("Arial", size=8)
        for order in user_with_data.orders:
            pdf.cell(col_widths[0], 10, txt=str(order.id), border=1)
            pdf.cell(col_widths[1], 10, txt=order.order_date.strftime('%Y-%m-%d %H:%M'), border=1)
            pdf.cell(col_widths[2], 10, txt=order.status, border=1)
            pdf.cell(col_widths[3], 10, txt=str(order.total_amount), border=1)
            pdf.cell(col_widths[4], 10, txt=order.shipping_address, border=1)
            pdf.ln()
            # On pourrait ajouter les items ici aussi, mais ça complexifie le tableau

        # Génération du PDF en bytes
        pdf_output_bytes = pdf.output(dest='S').encode('latin-1')

        headers = {'Content-Disposition': f'attachment; filename="{filename}.pdf"'}
        return StreamingResponse(io.BytesIO(pdf_output_bytes), media_type="application/pdf", headers=headers)

    else:
        # Ne devrait pas arriver avec l'enum, mais par sécurité
        raise HTTPException(status_code=400, detail="Invalid format specified")

# --- Route Admin pour Purge Manuelle (modifiée) ---

@router.post("/purge-inactive", status_code=status.HTTP_200_OK)
async def purge_inactive_users(
    inactive_days: int = 365,
    db: Session = Depends(get_db),
    current_admin: User = Depends(check_admin_user)
):
    """
    [ADMIN ONLY] Déclenche manuellement l'archivage et la suppression
    des utilisateurs considérés comme inactifs.
    """
    cutoff_date = datetime.utcnow() - timedelta(days=inactive_days)
    inactive_users = db.query(User).filter(
        User.role != 'admin',
        (User.last_login_at == None) | (User.last_login_at < cutoff_date)
    ).all()

    purged_count = 0
    errors = []

    for user in inactive_users:
        user_id_to_purge = user.id
        print(f"Archiving/Purging inactive user ID: {user_id_to_purge}")
        try:
            # Appelle la nouvelle logique d'archivage
            _archive_and_delete_user_data_for_route(user_id_to_purge, db)
            # Journalise la suppression
            _log_user_deletion(user_id_to_purge, db)
            # Supprime l'utilisateur
            db.delete(user)
            # Commit pour cet utilisateur
            db.commit()
            purged_count += 1
        except Exception as e:
            db.rollback()
            print(f"Error archiving/purging user ID {user_id_to_purge}: {e}")
            errors.append({"user_id": user_id_to_purge, "error": str(e)})

    return {
        "message": f"Archive/Purge attempt finished. {purged_count} inactive users processed.",
        "errors": errors
    }

# --- Fin de la route Admin ---

# --- Fin des nouvelles routes RGPD --- 