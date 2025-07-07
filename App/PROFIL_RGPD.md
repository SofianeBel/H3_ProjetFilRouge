# 👤 Système de Profil Utilisateur RGPD-Compliant

## 📋 Vue d'ensemble

Ce système implémente une page profil utilisateur complète avec gestion des consentements RGPD, export de données et suppression de compte conforme aux réglementations européennes.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités implémentées

- **Page profil responsive** avec onglets (`/profile`)
- **Gestion des informations personnelles** (nom, email)
- **Changement de mot de passe sécurisé** (vérification ancien mot de passe)
- **Gestion des consentements RGPD** (marketing, analytics, cookies, newsletter)
- **Export des données personnelles** (JSON téléchargeable)
- **Suppression de compte** (soft-delete + purge différée)
- **Script de purge CRON** (suppression définitive après 30 jours)
- **Journalisation de toutes les actions** (logs d'authentification)

### 🔒 Conformité RGPD

- ✅ **Droit d'accès** : visualisation de toutes les données personnelles
- ✅ **Droit de rectification** : modification des informations
- ✅ **Droit à l'effacement** : suppression de compte avec purge différée
- ✅ **Droit à la portabilité** : export des données en JSON
- ✅ **Gestion des consentements** : opt-in/opt-out pour chaque traitement
- ✅ **Traçabilité** : journalisation de toutes les actions utilisateur

## 🏗️ Architecture

### Routes API

```
/api/profile              # GET, PATCH, DELETE - Gestion du profil principal
/api/profile/consents     # PATCH - Mise à jour des consentements
/api/profile/export       # POST - Export des données utilisateur
/api/admin/cleanup        # GET, POST - Gestion du nettoyage (admin)
```

### Modèles de données

```prisma
model User {
  // Champs existants + nouveaux
  active        Boolean   @default(true)  // Soft-delete flag
  deletedAt     DateTime?                 // Date de suppression pour purge CRON
  
  // Relations RGPD
  consentRecords   DataProcessingConsent[]
  exportRequests   DataExportRequest[]
  authLogs         AuthenticationLog[]
}

model DataProcessingConsent {
  consentType String   // "marketing", "analytics", "cookies", "profiling"
  purpose     String   // Description détaillée du traitement
  granted     Boolean  // Consentement accordé ou non
  grantedAt   DateTime?
  revokedAt   DateTime?
  ipAddress   String?  // IP lors du consentement
  userAgent   String?  // Browser info
  
  @@unique([userId, consentType])
}

model DataExportRequest {
  status      DataExportStatus // PENDING, PROCESSING, COMPLETED, FAILED
  requestedAt DateTime
  completedAt DateTime?
  downloadUrl String?
  expiresAt   DateTime?        // URL d'expiration (24h)
  fileSize    Int?
}

model AuthenticationLog {
  event       AuthEventType    // LOGIN_SUCCESS, PROFILE_UPDATE, ACCOUNT_DELETED, etc.
  provider    String?
  success     Boolean
  ipAddress   String
  userAgent   String
  details     String?          // JSON avec détails supplémentaires
}
```

## 🎯 Guide d'utilisation

### 1. Accès à la page profil

L'utilisateur connecté peut accéder à son profil via `/profile`.

### 2. Onglet "Informations personnelles"

- Modification du nom et de l'email
- Affichage des statistiques du compte
- Changement d'email → déclenche une nouvelle vérification
- **RGPD** : Droit de rectification

### 3. Onglet "Sécurité"

- Changement de mot de passe sécurisé
- Vérification de l'ancien mot de passe obligatoire
- Déconnexion automatique après changement
- **RGPD** : Sécurité des données

### 4. Onglet "Confidentialité"

- Gestion des consentements par type :
  - 🎯 Marketing et communications
  - 📊 Analyses et statistiques
  - 🍪 Cookies non essentiels
  - 📧 Newsletter technique
- Export des données personnelles en JSON
- Information sur les droits RGPD
- **RGPD** : Droit d'accès, consentements, portabilité

### 5. Onglet "Zone de danger"

- Suppression de compte avec confirmation
- Saisie de "SUPPRIMER" pour confirmer
- Soft-delete immédiat + purge différée (30 jours)
- **RGPD** : Droit à l'effacement

## 🛠️ Configuration technique

### 1. Migration de la base de données

```bash
npx prisma migrate dev --name add_user_deletedAt_and_consent_unique
```

### 2. Ajout du lien dans le menu

Ajouter un lien vers `/profile` dans le menu utilisateur.

### 3. Configuration du CRON (production)

Pour automatiser la purge des comptes supprimés :

```bash
# Ajouter dans crontab (tous les jours à 2h du matin)
0 2 * * * /usr/bin/node /path/to/your/app/cron-cleanup.js
```

Ou utiliser un service comme **Vercel Cron** ou **GitHub Actions**.

### 4. Script de nettoyage manuel

Pour tester le nettoyage :

```bash
# Déclencher via API (admin requis)
POST /api/admin/cleanup

# Ou via script Node.js
import { runScheduledCleanup } from '@/lib/cron-cleanup'
await runScheduledCleanup()
```

## 📊 Monitoring et logs

### Journalisation automatique

Toutes les actions utilisateur sont automatiquement journalisées :

- **PROFILE_UPDATE** : Modification du profil ou consentements
- **ACCOUNT_DELETED** : Suppression de compte
- **LOGIN_SUCCESS/FAILED** : Connexions
- **PASSWORD_RESET_REQUEST** : Demande de reset

### Consultation des logs

Les logs sont accessibles via :
- Base de données : table `authentication_logs`
- Console serveur lors des opérations
- Export utilisateur (30 derniers jours inclus)

## 🚨 Points d'attention

### Sécurité

1. **Vérification de l'ancien mot de passe** obligatoire
2. **Validation des emails** avant mise à jour
3. **Rate limiting** recommandé sur les exports
4. **Validation des droits admin** pour le nettoyage

### RGPD

1. **Consentements granulaires** par type de traitement
2. **Logs de traçabilité** avec IP et User-Agent
3. **Purge automatique** après 30 jours (configurable)
4. **Export complet** de toutes les données

### Performance

1. **Pagination recommandée** pour les gros exports
2. **Limitation des logs** (ex: 100 derniers)
3. **Nettoyage régulier** des données expirées
4. **Index sur les tables** de logs et consentements

## 🔄 Évolutions possibles

### Court terme
- [ ] Interface admin pour visualiser les demandes de suppression
- [ ] Notification email lors de l'export de données
- [ ] Historique des modifications du profil

### Moyen terme
- [ ] Authentification à deux facteurs (2FA)
- [ ] Géolocalisation des connexions
- [ ] API de portabilité vers d'autres services
- [ ] Anonymisation intelligente des données

### Long terme
- [ ] Conformité CCPA (Californie)
- [ ] Chiffrement end-to-end des exports
- [ ] Audit trail complet des accès
- [ ] IA pour détection de comportements suspects

## 📞 Support

Pour toute question sur l'implémentation RGPD ou les fonctionnalités :

1. Consulter les logs de l'application
2. Vérifier la configuration Prisma
3. Tester les routes API via Postman/curl
4. Contacter l'équipe technique

---

**Conforme RGPD ✅ | Sécurisé 🔒 | Prêt pour la production 🚀** 