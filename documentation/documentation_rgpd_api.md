# Documentation RGPD : Fonctionnalités Utilisateur dans l'API Cyna E-Commerce

**Version:** 1.1
**Date:** 2024-04-28

## 1. Introduction

Cette documentation détaille la conception et l'implémentation des fonctionnalités clés relatives au Règlement Général sur la Protection des Données (RGPD) au sein de l'API backend de la plateforme Cyna E-Commerce. L'objectif est d'assurer la conformité tout en offrant une expérience utilisateur claire et sécurisée. Les fonctionnalités couvertes sont :

*   **🍎 Droit à l'effacement** : Suppression/anonymisation du compte et des données associées.
*   **🥝 Droit à la portabilité des données** : Exportation des données personnelles de l'utilisateur.
*   **🥐 Gestion des consentements (Infrastructure)** : Enregistrement et consultation de l'historique des consentements.
*   **🥨 Limitation de la Conservation (Infrastructure & Démo)** : Suivi de l'inactivité et logique de purge manuelle des comptes inactifs.

## 2. Facilité d'Utilisation et Accessibilité (Art. 12 RGPD)

Le design de l'API vise à rendre l'exercice des droits RGPD simple et accessible pour l'utilisateur final (via une interface frontend) et pour les développeurs intégrant l'API.

*   **Endpoints dédiés et clairs :**
    *   Les actions relatives à l'utilisateur connecté sont groupées sous le préfixe `/users/me/`.
    *   `DELETE /users/me` : Point d'accès unique et intuitif pour initier la suppression du compte (Droit à l'effacement).
    *   `GET /users/me/export` : Point d'accès clair pour demander l'export des données (Droit à la portabilité).
    *   `GET /users/me/consents` et `POST /users/me/consents` : Points d'accès logiques pour consulter et gérer les consentements.
    *   `POST /users/purge-inactive` : **[ADMIN ONLY]** Point d'accès pour déclencher *manuellement* la purge des utilisateurs inactifs (cf. section 4). Clarifie la logique de conservation, mais nécessite une automatisation externe pour une conformité complète.
*   **Authentification centralisée :** Toutes les routes requièrent une authentification via token JWT (`Depends(get_current_active_user)` ou `Depends(check_admin_user)` pour les routes admin). L'utilisateur n'a pas besoin de fournir d'identifiants supplémentaires ; l'API identifie l'utilisateur (ou l'admin) via son token valide, garantissant qu'il ne peut agir que dans le cadre de ses permissions.
*   **Réponses standardisées :**
    *   L'export (`GET /users/me/export`) retourne les données dans un format structuré standard (JSON), défini par le schéma Pydantic `UserDataExport`, facilement interprétable.
    *   La suppression (`DELETE /users/me`) retourne un statut `204 No Content`, indiquant le succès de l'opération.
    *   La gestion des consentements utilise des schémas Pydantic clairs (`ConsentLog`, `ConsentLogCreate`).
    *   La purge manuelle (`POST /users/purge-inactive`) retourne un résumé JSON des actions effectuées et des erreurs rencontrées.
*   **Accessibilité via API :** En fournissant ces fonctionnalités via une API RESTful, les interfaces utilisateur peuvent intégrer facilement les options pour les utilisateurs et les administrateurs.

## 3. Mesures de Sécurité (Art. 5(1)(f) & Art. 32 RGPD)

La sécurité des demandes des utilisateurs et des données traitées est une priorité.

*   **Sécurité des Demandes :**
    *   **Authentification robuste :** L'accès aux endpoints RGPD et admin est strictement contrôlé par l'authentification JWT.
    *   **Autorisation :** Les routes `/users/me/` sont limitées à l'utilisateur authentifié. Les routes admin (comme `/purge-inactive`) sont protégées par une vérification de rôle (`check_admin_user`), empêchant les utilisateurs standards d'y accéder.
    *   **Protection contre CSRF :** Utilisation de tokens Bearer.
    *   **HTTPS :** Déploiement via HTTPS impératif.
*   **Sécurité des Données Traitées :**
    *   **Hachage des mots de passe :** Utilisation de `passlib` (bcrypt).
    *   **Anonymisation lors de l'effacement/purge :** Remplacement des identifiants directs (`user_id` à `NULL`, `shipping_address` remplacée).
    *   **Journalisation sécurisée :** Les logs (`DeletionLog`, `ConsentLog`) sont stockés dans la base de données principale.
    *   **Validation des entrées :** Utilisation de Pydantic.
    *   **Sécurité de la base de données :** Mesures standard requises.
    *   **Mise à jour `last_login_at` sécurisée :** La mise à jour se fait côté serveur lors d'une authentification réussie, non manipulable directement par l'utilisateur.

## 4. Minimisation des Données et Limitation de la Conservation (Art. 5(1)(c, e) & Art. 25 RGPD)

Les principes de minimisation et de limitation de la conservation sont pris en compte.

*   **Principe Général (Conception) :** Viser à ne collecter que les données nécessaires.
*   **Lors de l'Effacement / Purge (🍎 / 🥨) :**
    *   **Justification :** Implémentation du droit à l'effacement et préparation à la limitation de la conservation.
    *   **Actions :**
        *   Suppression effective des données d'identification directe (`User`).
        *   Minimisation par anonymisation des données liées conservées (Commandes : `user_id=NULL`, `shipping_address` remplacée).
        *   Suppression complète des données transitoires (Panier).
    *   **Limitation de la Conservation :** L'ajout du champ `last_login_at` et de la logique de purge (même déclenchée manuellement via `/purge-inactive`) établit le **mécanisme technique** pour respecter la limitation de conservation. La **politique** (ex: 365 jours) est définie, et la logique d'identification et d'anonymisation/suppression est prête. **L'automatisation via une tâche planifiée externe est la prochaine étape nécessaire pour une application complète de ce principe.**
*   **Lors de l'Export (🥝) :**
    *   **Justification :** Portabilité des données de l'utilisateur.
    *   **Actions :** Fournit les données du compte et les commandes associées non-anonymisées, sans ajout de données superflues.
*   **Lors de la Gestion des Consentements (🥐) :**
    *   **Justification :** Preuve de consentement.
    *   **Actions :** Le `ConsentLog` ne stocke que `user_id`, `consent_type`, `granted`, `timestamp`.

## 5. Conclusion

L'API backend de Cyna E-Commerce implémente les fonctionnalités RGPD essentielles (Effacement, Portabilité, infrastructure de Consentement) et fournit les bases techniques pour la Limitation de la Conservation (suivi de `last_login_at`, logique de purge). L'accent est mis sur des points d'accès clairs et sécurisés. Les mesures de sécurité protègent les requêtes et les données, et le principe de minimisation est appliqué. La mise en place d'une tâche planifiée pour l'automatisation de la purge des comptes inactifs et une gestion frontend des consentements sont les prochaines étapes clés pour une conformité RGPD complète. La vigilance continue est nécessaire.