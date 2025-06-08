# 🛡️ Cyna - Site Vitrine Cybersécurité

Site vitrine moderne pour **Cyna**, pure player en cybersécurité spécialisé dans la protection des PME et MSP.

## 🚀 Technologies Utilisées

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL + Prisma ORM
- **Authentification**: NextAuth.js
- **Emails**: Resend
- **Déploiement**: Vercel (recommandé)

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL (local ou cloud)
- Compte Resend pour les emails (optionnel)

## 🛠️ Installation

### 1. Cloner et installer les dépendances

```bash
git clone <repository-url>
cd cyna-website
npm install
```

### 2. Configuration de l'environnement

Créer un fichier `.env.local` :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/cyna_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Resend (pour les emails)
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="contact@cyna-it.fr"

# Configuration du site
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Cyna - Cybersécurité pour PME et MSP"

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

### 3. Configuration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations (quand la DB est prête)
npx prisma db push

# Optionnel: Seed de données de test
npx prisma db seed
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
cyna-website/
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── api/               # Routes API backend
│   │   │   └── contact/       # API de contact
│   │   ├── globals.css        # Styles globaux
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Page d'accueil
│   ├── components/            # Composants React
│   │   ├── layout/           # Header, Footer
│   │   └── ui/               # Composants UI (Logo, etc.)
│   └── lib/                  # Utilitaires
├── prisma/                   # Schéma et migrations DB
├── public/                   # Assets statiques
└── templetes/               # Templates HTML originaux
```

## 🎨 Design System

### Couleurs Principales

- **Primary**: `#6B8DE5` (Bleu Cyna)
- **Secondary**: `#8E63E5` (Violet)
- **Accent**: `#A67FFB` (Violet clair)
- **Dark**: `#111318` (Fond principal)
- **Dark Secondary**: `#161A22` (Cartes)

### Composants Disponibles

- `<Logo />` - Logo Cyna avec tailles variables
- `<Header />` - Navigation principale responsive
- `<Footer />` - Pied de page avec liens
- Classes CSS utilitaires : `.btn-primary`, `.card-cyna`, etc.

## 🔧 APIs Disponibles

### POST /api/contact

Gestion des demandes de contact avec validation et envoi d'emails.

**Payload:**
```json
{
  "name": "string (requis)",
  "email": "string (requis)",
  "company": "string (optionnel)",
  "phone": "string (optionnel)",
  "service": "SOC|Audit|Pentest|CERT|Autre (optionnel)",
  "message": "string (requis)"
}
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement de production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://cyna-it.fr"
NEXTAUTH_SECRET="production-secret-key"
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="contact@cyna-it.fr"
NEXT_PUBLIC_APP_URL="https://cyna-it.fr"
```

## 📝 Fonctionnalités Implémentées

### ✅ Phase 1 - MVP
- [x] Design moderne responsive
- [x] Page d'accueil avec services
- [x] Navigation et footer
- [x] API de contact avec emails
- [x] Configuration Tailwind + Shadcn UI
- [x] Schéma base de données Prisma

### 🔄 Phase 2 - À Développer
- [ ] Pages services détaillées
- [ ] Système de blog
- [ ] Formulaire de prise de RDV
- [ ] Back-office admin
- [ ] Authentification NextAuth
- [ ] Newsletter
- [ ] Analytics et tracking

## 🛡️ Sécurité

- Validation des données avec Zod
- Protection CSRF intégrée Next.js
- Variables d'environnement sécurisées
- Headers de sécurité configurés

## 📞 Support

Pour toute question technique :
- Email: dev@cyna-it.fr
- Documentation: [docs.cyna-it.fr](https://docs.cyna-it.fr)

## 📄 Licence

© 2024 Cyna. Tous droits réservés.

---

**Développé avec ❤️ pour la cybersécurité française**
