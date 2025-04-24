# alembic/env.py
import sys
import os
from pathlib import Path
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- Modification de sys.path (Alternative) ---
# Obtient le répertoire depuis lequel la commande alembic est lancée (devrait être app/back)
current_working_directory = Path(os.getcwd())
# Construit le chemin vers le dossier src
src_path = current_working_directory / 'src'
# Ajoute le chemin src au sys.path
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))
# --- Fin de la modification ---

# --- Maintenant, les imports de votre projet devraient fonctionner ---
from models.models import Base # Importez votre modèle Base
from config import get_settings # Importez les paramètres

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
     # Gestion si DATABASE_URL n'est pas trouvée dans les settings
     print("Warning: DATABASE_URL not found in settings.")
     # Vous pourriez vouloir lever une exception ici ou utiliser une valeur par défaut de alembic.ini
     # db_url = config.get_main_option("sqlalchemy.url") # Lire depuis alembic.ini comme fallback


# Set target metadata
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    # Utilise l'URL définie via config.set_main_option
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
    # Utilise la configuration définie via config.set_main_option
    # engine_from_config lira sqlalchemy.url
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