# alembic/env.py
import sys
import os
from pathlib import Path
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- Modification de sys.path (Nouvelle approche) ---
# Ajoute le dossier racine du backend (app/back) au sys.path
# Cela permet les imports absolus depuis 'src'
project_root = Path(__file__).parent.parent # Chemin vers app/back
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
# --- Fin de la modification ---

# --- Imports depuis votre projet (maintenant absolus depuis la racine ajoutée) ---
try:
    # Importe Base depuis src.models.models
    from src.models.models import Base
    # Importe get_settings depuis src.config
    from src.config import get_settings
except ImportError as e:
     # Log plus détaillé en cas d'échec
     print(f"Erreur lors de l'importation des modules du projet dans env.py.")
     print(f"Vérifiez que vous lancez alembic depuis le dossier 'app/back'.")
     print(f"Chemin ajouté à sys.path: {project_root}")
     print(f"sys.path actuel: {sys.path}")
     print(f"Erreur détaillée: {e}")
     raise e

# Load environment variables if you use python-dotenv
# from dotenv import load_dotenv
# load_dotenv()

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set database URL from settings
settings = get_settings()
db_url = settings.DATABASE_URL # Utilisation de l'objet settings

if db_url:
     config.set_main_option('sqlalchemy.url', db_url)
else:
     # Gérer le cas où DATABASE_URL n'est pas trouvée
     print("Warning: DATABASE_URL not found in settings.")
     # Gérer le cas où DATABASE_URL n'est pas trouvée

# Set target metadata
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    if not url:
         raise ValueError("Database URL not configured correctly for offline mode.")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()