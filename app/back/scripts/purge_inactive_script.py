import sys
import os
from pathlib import Path
from datetime import datetime, timedelta
import logging # Utilisation du module logging

# --- Configuration du Chemin ---
# Ajoute le dossier 'src' au sys.path pour trouver les modules
# S'assure que le script peut être lancé depuis le dossier app/back
try:
    current_dir = Path(__file__).parent
    project_root = current_dir.parent # Remonte au dossier app/back
    src_path = project_root / 'src'
    if str(src_path) not in sys.path:
        sys.path.insert(0, str(src_path))
except NameError:
    # Si __file__ n'est pas défini (ex: exécution interactive)
    project_root = Path(os.getcwd()) # Suppose lancé depuis app/back
    src_path = project_root / 'src'
    if str(src_path) not in sys.path:
        sys.path.insert(0, str(src_path))

# --- Configuration du Logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(project_root / "purge_inactive.log"), # Log dans un fichier
        logging.StreamHandler() # Log aussi dans la console
    ]
)

# --- Imports depuis votre projet ---
try:
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import create_engine
    from config import get_settings
    # from database import Base # Cet import n'est pas directement utilisé ici
    from models.models import User, Order, CartItem, DeletionLog, OrderItem, Payment, ArchivedOrder, ArchivedOrderItem, ArchivedPayment
    # Import des fonctions helper depuis users.py
    from routes.users import _log_user_deletion
except ImportError as e:
    logging.error(f"Erreur d'importation critique. Vérifiez PYTHONPATH ou lancez depuis 'app/back'. Détail: {e}", exc_info=True)
    sys.exit(1)

# --- Configuration de la Purge ---
INACTIVE_DAYS_THRESHOLD = 365 # Nombre de jours d'inactivité avant purge

# --- Fonctions Helper pour l'Archivage/Anonymisation --- 

def _archive_and_delete_user_data(user_id: int, db: Session):
    """Archive les données de commande, supprime les originaux et le panier."""
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    archived_count = 0

    for order in orders:
        logging.debug(f"  Archivage de la commande ID: {order.id}")
        # 1. Créer la commande archivée anonymisée
        archived_order = ArchivedOrder(
            id=order.id,
            original_user_id=order.user_id,
            order_date=order.order_date,
            status=order.status,
            total_amount=order.total_amount,
            shipping_address="Anonymized Address", # Anonymisation
            created_at=order.created_at,
            updated_at=order.updated_at
            # archived_at est défini par défaut
        )
        db.add(archived_order)
        # Il faut flush pour obtenir l'ID si on en a besoin tout de suite,
        # mais ici on peut attendre le commit groupé par utilisateur.

        # 2. Archiver les OrderItems associés
        for item in order.items:
            archived_item = ArchivedOrderItem(
                id=item.id,
                order_id=archived_order.id, # Utilise l'ID de la commande archivée (sera lié après commit)
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=item.unit_price
            )
            db.add(archived_item)
            # Supprimer l'original OrderItem
            db.delete(item)

        # 3. Archiver les Payments associés
        for payment in order.payments:
             archived_payment = ArchivedPayment(
                 id=payment.id,
                 order_id=archived_order.id,
                 payment_date=payment.payment_date,
                 payment_method=payment.payment_method,
                 status=payment.status,
                 amount=payment.amount,
                 transaction_id=payment.transaction_id
             )
             db.add(archived_payment)
             # Supprimer le Payment original
             db.delete(payment)

        # 4. Supprimer la commande originale
        db.delete(order)
        archived_count += 1

    logging.debug(f"  {archived_count} commandes archivées.")

    # 5. Supprimer les CartItems (pas d'archivage)
    cart_items_to_delete = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if cart_items_to_delete:
        logging.debug(f"  Suppression de {len(cart_items_to_delete)} articles du panier.")
        for item in cart_items_to_delete:
            db.delete(item)

def run_purge():
    """Fonction principale exécutant la logique de purge (archivage/suppression)."""
    logging.info("--- Démarrage du script de purge des utilisateurs inactifs ---")
    logging.info(f"Seuil d'inactivité: {INACTIVE_DAYS_THRESHOLD} jours")

    settings = get_settings()
    if not settings.DATABASE_URL:
        logging.error("Erreur critique: DATABASE_URL n'est pas configurée dans les paramètres.")
        sys.exit(1)

    engine = None
    db = None
    purged_count = 0
    errors = []

    try:
        # Connexion à la base de données
        engine = create_engine(settings.DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        logging.info("Connexion à la base de données établie.")

        # Calcul de la date limite
        cutoff_date = datetime.now(datetime.UTC) - timedelta(days=INACTIVE_DAYS_THRESHOLD)
        logging.info(f"Date limite pour dernière connexion: {cutoff_date.strftime('%Y-%m-%d %H:%M:%S')} UTC")

        # Requête pour trouver les utilisateurs inactifs (non-admin)
        inactive_users = db.query(User).filter(
            User.role != 'admin',
            (User.last_login_at.is_(None)) | (User.last_login_at < cutoff_date)
        ).all()

        logging.info(f"Nombre d'utilisateurs inactifs trouvés: {len(inactive_users)}")

        if not inactive_users:
            logging.info("Aucun utilisateur inactif à purger.")
            return # Termine proprement si rien à faire

        # Traitement de chaque utilisateur inactif
        for user in inactive_users:
            user_id_to_purge = user.id
            user_email = user.email
            logging.info(f"Traitement de l'utilisateur ID: {user_id_to_purge} (Email: {user_email}) pour archivage/suppression.")
            try:
                # Appeler la nouvelle fonction d'archivage/suppression des données liées
                _archive_and_delete_user_data(user_id_to_purge, db)

                # Journaliser la suppression de l'utilisateur
                _log_user_deletion(user_id_to_purge, db)

                # Supprimer l'utilisateur lui-même
                db.delete(user)

                # Commit toutes les opérations pour cet utilisateur
                db.commit()
                purged_count += 1
                logging.info(f"  -> Utilisateur ID {user_id_to_purge} archivé/supprimé avec succès.")

            except Exception as e:
                logging.error(f"  -> ERREUR lors du traitement de l'utilisateur ID {user_id_to_purge} (Email: {user_email}): {e}", exc_info=False)
                db.rollback() # Annule les changements pour CET utilisateur
                errors.append({"user_id": user_id_to_purge, "email": user_email, "error": str(e)})

        logging.info("--- Fin du traitement des utilisateurs ---")

    except Exception as e:
        logging.error(f"Erreur générale lors de l'exécution de la logique de purge: {e}", exc_info=True)
        if db:
            db.rollback() # Assure un rollback en cas d'erreur avant la boucle
    finally:
        # Nettoyage
        if db:
            db.close()
            logging.info("Session de base de données fermée.")
        if engine:
            engine.dispose()
            logging.info("Engine de base de données disposé.")

    # --- Résumé Final ---
    logging.info(f"--- Résumé de la purge ---")
    logging.info(f"Nombre total d'utilisateurs traités avec succès: {purged_count}")
    if errors:
        logging.warning(f"Nombre d'erreurs rencontrées: {len(errors)}")
        for i, err in enumerate(errors):
            logging.warning(f"  - Erreur {i+1}: Utilisateur ID {err.get('user_id', 'N/A')} ({err.get('email', 'N/A')}) - {err.get('error', 'Inconnue')}")
    else:
        logging.info("Aucune erreur rencontrée.")
    logging.info("--- Fin du script de purge ---")

if __name__ == "__main__":
    # Permet d'exécuter le script directement avec `python scripts/purge_inactive_script.py`
    run_purge()
