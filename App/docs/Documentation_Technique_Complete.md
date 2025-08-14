# 📚 Documentation Technique Complète
## Projet Cyna - Plateforme de Cybersécurité pour PME et MSP

---

## 📋 **Table des Matières**

1. [Vue d'ensemble du Projet](#1-vue-densemble-du-projet)
2. [Architecture Technique](#2-architecture-technique)
3. [Stack Technologique](#3-stack-technologique)
4. [Structure du Code](#4-structure-du-code)
5. [Base de Données](#5-base-de-données)
6. [API et Endpoints](#6-api-et-endpoints)
7. [Authentification et Sécurité](#7-authentification-et-sécurité)
8. [Intégrations Externes](#8-intégrations-externes)
9. [Déploiement](#9-déploiement)
10. [Tests et Qualité](#10-tests-et-qualité)
11. [Monitoring et Observabilité](#11-monitoring-et-observabilité)
12. [Maintenance et Evolution](#12-maintenance-et-evolution)

---

## 🎯 **1. Vue d'ensemble du Projet**

### **Description**
Cyna est une plateforme web moderne dédiée à la cybersécurité pour les PME et MSP (Managed Service Providers). La plateforme propose des services de cybersécurité tels que SOC 24/7, audits de sécurité, pentests, et réponse à incidents.

### **Objectifs Fonctionnels**
- **Vitrine Commerciale** : Présentation des services de cybersécurité
- **E-commerce** : Vente de services avec paiement intégré
- **Gestion Client** : Tableau de bord utilisateur et gestion des commandes
- **Content Management** : Blog, études de cas, documentation
- **Administration** : Back-office pour la gestion de la plateforme

### **Utilisateurs Cibles**
- **PME** : Petites et moyennes entreprises cherchant protection cybersécurité
- **MSP** : Managed Service Providers offrant services à leurs clients
- **Administrateurs** : Équipe Cyna gérant la plateforme

---

## 🏗️ **2. Architecture Technique**

### **Patterns Architecturaux**
- **Server-Side Rendering (SSR)** : Next.js App Router
- **API-First** : Architecture orientée API REST
- **Microservices Modulaires** : Services métier indépendants
- **JAMstack** : JavaScript, APIs, Markup

### **Principes de Design**
- **Separation of Concerns** : Séparation claire des responsabilités
- **DRY (Don't Repeat Yourself)** : Réutilisation du code
- **SOLID Principles** : Principes de programmation orientée objet
- **Security by Design** : Sécurité intégrée dès la conception

### **Architecture en Couches**
```
┌─────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (React Components)           │   │
│  │  - Pages & Layouts                              │   │
│  │  - UI Components (Shadcn/ui)                   │   │
│  │  - State Management (Context API)              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   API LAYER                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Next.js API Routes                             │   │
│  │  - REST Endpoints                               │   │
│  │  - Middleware (Auth, CORS, Rate Limiting)      │   │
│  │  - Input Validation (Zod)                      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Services & Business Logic                      │   │
│  │  - Authentication Service                       │   │
│  │  - E-commerce Service                           │   │
│  │  - Content Management Service                   │   │
│  │  - RGPD Compliance Service                      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Data Access & Persistence                      │   │
│  │  - Prisma ORM                                   │   │
│  │  - PostgreSQL Database                          │   │
│  │  - Redis Cache                                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ **3. Stack Technologique**

### **Frontend**
| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 15.3.3 | Framework React full-stack |
| **React** | 19.0.0 | Bibliothèque UI |
| **TypeScript** | 5.x | Langage typé |
| **Tailwind CSS** | 4.1.8 | Framework CSS utilitaire |
| **Shadcn/ui** | Latest | Composants UI |
| **Framer Motion** | 12.17.0 | Animations |
| **Lucide React** | 0.513.0 | Icônes |

### **Backend**
| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js API Routes** | 15.3.3 | Endpoints API REST |
| **NextAuth.js** | 5.0.0-beta.28 | Authentification |
| **Prisma** | 6.9.0 | ORM base de données |
| **PostgreSQL** | 14+ | Base de données relationnelle |
| **bcryptjs** | 3.0.2 | Hachage mots de passe |
| **Zod** | 3.25.56 | Validation des données |

### **Services Externes**
| Service | Usage |
|---------|-------|
| **Stripe** | Paiements et facturation |
| **Resend** | Envoi d'emails transactionnels |
| **Google OAuth** | Authentification sociale |
| **Vercel** | Hébergement et déploiement |
| **Neon/Supabase** | Base de données PostgreSQL managée |

### **Outils de Développement**
| Outil | Usage |
|-------|-------|
| **ESLint** | Linting JavaScript/TypeScript |
| **Prettier** | Formatage de code |
| **Husky** | Git hooks |
| **Commitlint** | Convention de commits |

---

## 📁 **4. Structure du Code**

### **Organisation des Dossiers**
```
App/
├── prisma/                      # Schéma et migrations DB
│   ├── schema.prisma           # Définition du modèle de données
│   ├── migrations/             # Migrations de base de données
│   └── seed.ts                 # Données d'initialisation
├── public/                     # Assets statiques
│   ├── sw.js                   # Service Worker
│   └── *.svg                   # Icônes et images
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Routes publiques
│   │   │   ├── about/          # Page À propos
│   │   │   ├── blog/           # Blog et articles
│   │   │   ├── booking/        # Prise de rendez-vous
│   │   │   ├── cart/           # Panier d'achat
│   │   │   ├── case-studies/   # Études de cas
│   │   │   ├── checkout/       # Processus de commande
│   │   │   ├── orders/         # Historique commandes
│   │   │   ├── profile/        # Profil utilisateur
│   │   │   └── services/       # Pages services
│   │   ├── admin/              # Interface d'administration
│   │   │   ├── blog/           # Gestion blog
│   │   │   ├── bookings/       # Gestion RDV
│   │   │   ├── contacts/       # Gestion contacts
│   │   │   ├── orders/         # Gestion commandes
│   │   │   └── users/          # Gestion utilisateurs
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # Authentification
│   │   │   ├── blog/           # API Blog
│   │   │   ├── booking/        # API Booking
│   │   │   ├── cart/           # API Panier
│   │   │   ├── contact/        # API Contact
│   │   │   ├── orders/         # API Commandes
│   │   │   ├── profile/        # API Profil utilisateur
│   │   │   ├── services/       # API Services
│   │   │   └── webhooks/       # Webhooks externes
│   │   ├── auth/               # Pages authentification
│   │   ├── globals.css         # Styles globaux
│   │   └── layout.tsx          # Layout racine
│   ├── components/             # Composants React
│   │   ├── admin/              # Composants admin
│   │   ├── layout/             # Composants de layout
│   │   ├── motion/             # Composants d'animation
│   │   ├── providers/          # Context providers
│   │   ├── sections/           # Sections de pages
│   │   └── ui/                 # Composants UI réutilisables
│   ├── context/                # Contexts React
│   ├── hooks/                  # Hooks personnalisés
│   ├── lib/                    # Utilitaires et configuration
│   ├── styles/                 # Styles CSS
│   └── types/                  # Définitions TypeScript
├── docs/                       # Documentation projet
├── package.json                # Dépendances et scripts
├── tailwind.config.js          # Configuration Tailwind
├── tsconfig.json               # Configuration TypeScript
├── next.config.mjs             # Configuration Next.js
└── middleware.ts               # Middleware Next.js
```

### **Conventions de Nommage**
- **Fichiers** : kebab-case (`user-profile.tsx`)
- **Composants** : PascalCase (`UserProfile`)
- **Variables/Fonctions** : camelCase (`getUserProfile`)
- **Constants** : UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types** : PascalCase (`UserProfileType`)

---

## 🗄️ **5. Base de Données**

### **Modèle de Données Prisma**

#### **Entités Principales**
- **User** : Utilisateurs du système
- **Contact** : Demandes de contact
- **Booking** : Prises de rendez-vous
- **BlogPost** : Articles de blog
- **Category** : Catégories de contenu
- **Service** : Services de cybersécurité
- **ServicePlan** : Plans tarifaires des services
- **Order** : Commandes e-commerce
- **JobOffer** : Offres d'emploi

#### **Entités RGPD et Sécurité**
- **DataProcessingConsent** : Consentements RGPD
- **DataExportRequest** : Demandes d'export de données
- **AuthenticationLog** : Logs d'authentification
- **UserAddress** : Adresses utilisateur
- **UserPaymentMethod** : Méthodes de paiement

#### **Relations Clés**
```sql
-- Un utilisateur peut avoir plusieurs commandes
User 1:N Order

-- Un service peut avoir plusieurs plans
Service 1:N ServicePlan

-- Un article appartient à une catégorie
BlogPost N:1 Category

-- Un utilisateur peut avoir plusieurs consentements
User 1:N DataProcessingConsent

-- Une commande peut avoir des adresses de facturation/livraison
Order N:1 UserAddress (billing)
Order N:1 UserAddress (shipping)
```

### **Index et Optimisations**
```sql
-- Index pour les recherches fréquentes
@@index([userId, createdAt])           -- AuthenticationLog
@@index([published, createdAt])        -- BlogPost
@@index([email])                       -- User
@@index([slug])                        -- Service, BlogPost
@@unique([email])                      -- User
@@unique([slug])                       -- Service, BlogPost, Category
```

### **Politique de Rétention**
- **Logs d'authentification** : 2 ans
- **Données utilisateur** : 7 ans après suppression du compte
- **Commandes** : Permanentes (obligations légales)
- **Consentements RGPD** : 3 ans après révocation

---

## 🔗 **6. API et Endpoints**

### **Structure des API Routes**

#### **Authentification (`/api/auth/`)**
```typescript
// POST /api/auth/register
interface RegisterRequest {
  name: string
  email: string
  password: string
  acceptTerms: boolean
}

// POST /api/auth/forgot-password
interface ForgotPasswordRequest {
  email: string
}

// POST /api/auth/reset-password
interface ResetPasswordRequest {
  token: string
  password: string
}
```

#### **Gestion des Services (`/api/services/`)**
```typescript
// GET /api/services
interface ServiceResponse {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  purchaseType: 'PRE_CONFIGURED' | 'QUOTE'
  plans: ServicePlan[]
}

// GET /api/services/[slug]/plans
interface ServicePlanResponse {
  id: string
  name: string
  price: number
  features: string[]
  popular: boolean
}
```

#### **E-commerce (`/api/cart/`, `/api/orders/`)**
```typescript
// POST /api/cart/checkout
interface CheckoutRequest {
  items: CartItem[]
  billingAddress: AddressData
  paymentMethodId?: string
}

// GET /api/orders
interface OrderResponse {
  id: string
  amount: number
  status: string
  createdAt: string
  items: OrderItem[]
}
```

#### **RGPD (`/api/profile/`)**
```typescript
// POST /api/profile/export
interface DataExportResponse {
  requestId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED'
  estimatedTime: string
}

// POST /api/profile/consents
interface ConsentRequest {
  consentType: 'marketing' | 'analytics' | 'cookies'
  granted: boolean
}
```

### **Standards API**

#### **Format de Réponse**
```typescript
// Réponse de succès
interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

// Réponse d'erreur
interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
```

#### **Codes de Statut HTTP**
- **200** : Succès
- **201** : Ressource créée
- **400** : Erreur de validation
- **401** : Non authentifié
- **403** : Non autorisé
- **404** : Ressource non trouvée
- **429** : Rate limit dépassé
- **500** : Erreur serveur

#### **Rate Limiting**
```typescript
// Configuration par endpoint
const rateLimits = {
  '/api/auth/login': '10 req/min',
  '/api/contact': '5 req/min',
  '/api/booking': '3 req/min',
  '/api/services': '100 req/min'
}
```

---

## 🔐 **7. Authentification et Sécurité**

### **NextAuth.js Configuration**

#### **Providers Configurés**
```typescript
// Configuration des providers d'authentification
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      // Validation avec bcryptjs
      // Vérification email vérifié
      // Logs d'authentification
    }
  })
]
```

#### **Callbacks et Session**
```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role
      token.id = user.id
    }
    return token
  },
  async session({ session, token }) {
    session.user.id = token.id
    session.user.role = token.role
    return session
  }
}
```

### **Sécurité des Mots de Passe**
```typescript
// Hachage avec bcryptjs (rounds: 12)
const hashedPassword = await bcrypt.hash(password, 12)

// Validation force mot de passe
const passwordValidation = z.string()
  .min(8, 'Minimum 8 caractères')
  .regex(/[A-Z]/, 'Au moins une majuscule')
  .regex(/[a-z]/, 'Au moins une minuscule')
  .regex(/[0-9]/, 'Au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial')
```

### **Middleware de Sécurité**
```typescript
// middleware.ts - Protection des routes
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Protection routes admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  // Rate limiting
  const ip = request.ip || 'anonymous'
  const rateLimit = await checkRateLimit(ip, request.nextUrl.pathname)
  if (!rateLimit.allowed) {
    return new Response('Too Many Requests', { status: 429 })
  }
}
```

### **Headers de Sécurité**
```typescript
// next.config.mjs - Headers sécurisés
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval'"
        }
      ]
    }
  ]
}
```

### **Validation des Données**
```typescript
// Schémas Zod pour validation
const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{8})$/).optional(),
  service: z.enum(['SOC', 'Audit', 'Pentest', 'CERT']).optional(),
  message: z.string().min(10).max(1000)
})
```

---

## 🔌 **8. Intégrations Externes**

### **Stripe - Paiements**

#### **Configuration**
```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true
})
```

#### **Création Payment Intent**
```typescript
// api/cart/checkout/route.ts
export async function POST(request: Request) {
  const { amount, currency = 'eur', items } = await request.json()
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId: orderId,
      userId: session.user.id
    }
  })
  
  return NextResponse.json({
    clientSecret: paymentIntent.client_secret
  })
}
```

#### **Gestion des Webhooks**
```typescript
// api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!
  const body = await request.text()
  
  const event = stripe.webhooks.constructEvent(
    body, sig, process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object)
      break
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object)
      break
  }
}
```

### **Resend - Emails**

#### **Configuration**
```typescript
// lib/email.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

#### **Templates d'Email**
```typescript
// Confirmation de commande
export async function sendOrderConfirmation(order: Order) {
  await resend.emails.send({
    from: 'Cyna <noreply@cyna-it.fr>',
    to: order.user.email,
    subject: `Confirmation de commande #${order.id}`,
    html: await renderOrderTemplate(order)
  })
}

// Récupération de mot de passe
export async function sendPasswordReset(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
  
  await resend.emails.send({
    from: 'Cyna <noreply@cyna-it.fr>',
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <h2>Réinitialisation de mot de passe</h2>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expire dans 1 heure.</p>
    `
  })
}
```

### **Google OAuth**

#### **Configuration NextAuth**
```typescript
// auth.ts
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      prompt: 'consent',
      access_type: 'offline',
      response_type: 'code'
    }
  }
})
```

---

## 🚀 **9. Déploiement**

### **Environnements**

#### **Développement Local**
```bash
# Installation des dépendances
npm install

# Configuration de la base de données
npx prisma generate
npx prisma db push

# Lancement du serveur de développement
npm run dev
```

#### **Variables d'Environnement**
```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/cyna_db"

# NextAuth.js
NEXTAUTH_URL="https://app.cyna-it.fr"
NEXTAUTH_SECRET="your-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@cyna-it.fr"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Configuration
NEXT_PUBLIC_APP_URL="https://app.cyna-it.fr"
```

### **Pipeline CI/CD (GitHub Actions)**

#### **Workflow de Déploiement**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: npm run test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### **Configuration Vercel**

#### **vercel.json**
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  },
  "regions": ["cdg1", "fra1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 🧪 **10. Tests et Qualité**

### **Stratégie de Test**

#### **Tests Unitaires (Jest)**
```typescript
// __tests__/utils/validation.test.ts
import { validateEmail } from '@/lib/validation'

describe('Email Validation', () => {
  test('should validate correct email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })
  
  test('should reject invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false)
  })
})
```

#### **Tests d'Intégration (API)**
```typescript
// __tests__/api/auth.test.ts
import { POST } from '@/app/api/auth/register/route'

describe('/api/auth/register', () => {
  test('should register new user', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123!'
      })
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
  })
})
```

#### **Tests E2E (Playwright)**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user login flow', async ({ page }) => {
  await page.goto('/auth/login')
  
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'SecurePass123!')
  await page.click('[data-testid="login-button"]')
  
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('[data-testid="user-name"]')).toBeVisible()
})
```

### **Qualité du Code**

#### **Configuration ESLint**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  }
}
```

#### **Husky Pre-commit Hooks**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

---

## 📊 **11. Monitoring et Observabilité**

### **Métriques et Analytics**

#### **Vercel Analytics**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### **Custom Metrics**
```typescript
// lib/analytics.ts
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      ...properties,
      timestamp: new Date().toISOString()
    })
  }
}

// Usage
trackEvent('service_purchased', {
  service_name: 'SOC 24/7',
  plan: 'PME',
  amount: 299.99
})
```

### **Logging et Debugging**

#### **Structured Logging**
```typescript
// lib/logger.ts
interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  context?: Record<string, any>
  timestamp: string
  userId?: string
  requestId?: string
}

export function log(entry: Omit<LogEntry, 'timestamp'>) {
  const logEntry: LogEntry = {
    ...entry,
    timestamp: new Date().toISOString()
  }
  
  if (process.env.NODE_ENV === 'production') {
    // Envoyer vers service de logging externe
    console.log(JSON.stringify(logEntry))
  } else {
    console.log(logEntry)
  }
}
```

#### **Error Tracking**
```typescript
// lib/error-tracking.ts
export function captureException(error: Error, context?: Record<string, any>) {
  log({
    level: 'error',
    message: error.message,
    context: {
      ...context,
      stack: error.stack,
      name: error.name
    }
  })
  
  // En production, envoyer vers Sentry ou service similaire
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: context })
  }
}
```

### **Health Checks**

#### **API Health Check**
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    stripe: await checkStripe(),
    resend: await checkResend()
  }
  
  const isHealthy = Object.values(checks).every(Boolean)
  
  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  }, {
    status: isHealthy ? 200 : 503
  })
}
```

---

## 🔧 **12. Maintenance et Evolution**

### **Stratégie de Mise à Jour**

#### **Dépendances**
```bash
# Audit sécurité régulier
npm audit
npm audit fix

# Mise à jour des dépendances
npm update
npx npm-check-updates -u

# Tests après mise à jour
npm run test
npm run build
```

#### **Database Migrations**
```typescript
// prisma/migrations/add_new_feature.sql
-- Migration pour nouvelle fonctionnalité
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN two_factor_secret TEXT;

-- Index pour optimisation
CREATE INDEX idx_users_two_factor ON users(two_factor_enabled);
```

### **Monitoring des Performances**

#### **Core Web Vitals**
```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Envoyer les métriques vers service d'analytics
  trackEvent('web_vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating
  })
}

// Mesurer toutes les métriques importantes
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### **Sauvegarde et Récupération**

#### **Stratégie de Sauvegarde**
- **Backups Automatiques** : Quotidiens avec rétention 30 jours
- **Backups Hebdomadaires** : Rétention 6 mois
- **Backups Mensuels** : Rétention 2 ans
- **Tests de Récupération** : Mensuels

#### **Procédure de Récupération**
```bash
# Restauration depuis backup
pg_restore --verbose --clean --no-acl --no-owner \
  -h localhost -U postgres -d cyna_db backup_file.sql

# Vérification de l'intégrité
npx prisma db pull
npx prisma generate
npm run test:integration
```

### **Documentation et Formation**

#### **Documentation Utilisateur**
- **Guides d'utilisation** : Documentation client
- **FAQ** : Questions fréquentes
- **Tutoriels** : Guides pas-à-pas
- **API Documentation** : OpenAPI/Swagger

#### **Documentation Technique**
- **Architecture** : Ce document
- **Deployment Guide** : Guide de déploiement
- **Troubleshooting** : Guide de résolution de problèmes
- **Security Policies** : Politiques de sécurité

---

*Documentation Technique Complète v2.0 - Projet Cyna*
*Dernière mise à jour : Janvier 2025*
