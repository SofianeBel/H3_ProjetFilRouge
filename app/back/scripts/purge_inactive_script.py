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
    from models.models import User, Order, CartItem, DeletionLog
    # Import des fonctions helper depuis users.py
    from routes.users import _anonymize_user_orders, _delete_user_cart_items, _log_user_deletion
except ImportError as e:
    logging.error(f"Erreur d'importation critique. Vérifiez PYTHONPATH ou lancez depuis 'app/back'. Détail: {e}", exc_info=True)
    sys.exit(1)

# --- Configuration de la Purge ---
INACTIVE_DAYS_THRESHOLD = 365 # Nombre de jours d'inactivité avant purge

def run_purge():
    """Fonction principale exécutant la logique de purge."""
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
            logging.info(f"Traitement de l'utilisateur ID: {user_id_to_purge} (Email: {user_email})")
            try:
                # Appliquer les opérations dans une transaction pour cet utilisateur
                _anonymize_user_orders(user_id_to_purge, db)
                _delete_user_cart_items(user_id_to_purge, db)
                _log_user_deletion(user_id_to_purge, db)
                db.delete(user)
                db.commit() # Commit les changements pour cet utilisateur
                purged_count += 1
                logging.info(f"  -> Utilisateur ID {user_id_to_purge} traité avec succès.")
            except Exception as e:
                logging.error(f"  -> ERREUR lors du traitement de l'utilisateur ID {user_id_to_purge} (Email: {user_email}): {e}", exc_info=False) # exc_info=False pour ne pas polluer les logs avec la trace complète pour chaque user
                db.rollback() # Annule les changements pour CET utilisateur
                errors.append({"user_id": user_id_to_purge, "email": user_email, "error": str(e)})
                # La session est prête pour la prochaine itération après rollback

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
