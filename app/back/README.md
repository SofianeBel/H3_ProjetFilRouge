# Cyna E-Commerce API

API backend pour la plateforme e-commerce Cyna, développée avec FastAPI et PostgreSQL.

## Prérequis

- Python 3.8+
- PostgreSQL 12+
- pip (gestionnaire de paquets Python)

## Installation

1. Cloner le repository :
```bash
git clone <repository_url>
cd app/back
```

2. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
```

3. Installer les dépendances :
```bash
pip install -r requirements.txt
```

4. Configurer les variables d'environnement :
Créer un fichier `.env` à la racine du projet avec les variables suivantes :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/cyna_ecommerce
JWT_SECRET_KEY=your-secret-key-here
```

5. Initialiser la base de données :
```bash
# Créer la base de données
createdb cyna_ecommerce

# Initialiser Alembic
alembic init alembic

# Créer et appliquer les migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Lancement du serveur

Pour lancer le serveur de développement :
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

L'API sera accessible à l'adresse : http://localhost:8000

La documentation interactive (Swagger UI) sera disponible à : http://localhost:8000/docs

## Structure du projet

```
app/back/
├── src/
│   ├── models/         # Modèles SQLAlchemy
│   ├── routes/         # Routes de l'API
│   ├── schemas/        # Schémas Pydantic
│   ├── config.py      # Configuration
│   ├── database.py    # Configuration base de données
│   ├── main.py        # Point d'entrée
│   └── security.py    # Sécurité et auth
├── alembic/           # Migrations
├── requirements.txt   # Dépendances
└── .env              # Variables d'environnement
```

## Points d'API principaux

### Authentification
- POST /token - Connexion utilisateur
- POST /register - Inscription utilisateur

### Produits
- GET /products - Liste des produits
- POST /products - Créer un produit (admin)
- GET /products/{id} - Détails d'un produit
- PUT /products/{id} - Modifier un produit (admin)
- DELETE /products/{id} - Supprimer un produit (admin)

### Panier
- GET /cart - Voir son panier
- POST /cart - Ajouter au panier
- PUT /cart/{id} - Modifier quantité
- DELETE /cart/{id} - Retirer du panier

### Commandes
- GET /orders - Liste des commandes
- POST /orders - Créer une commande
- GET /orders/{id} - Détails d'une commande
- PUT /orders/{id}/status - Modifier statut (admin)

## Sécurité

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Les tokens doivent être inclus dans le header Authorization :
```
Authorization: Bearer <token>
```

## Tests

Pour exécuter les tests :
```bash
pytest
```

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 