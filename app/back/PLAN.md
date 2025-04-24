5.  **Phase 5: Finalisation & Améliorations**
    # ... (unchanged items like revue code, erreurs, logging, docs, rate limiting, tests) ...
    - [ ] Augmentation de la couverture de tests.
    - [ ] Préparation pour le déploiement (Dockerfile).

6.  **Phase 6: Implémentation RGPD (À faire)**
    - **Droits des utilisateurs:**
        - [x] Ajouter endpoint `DELETE /users/me` pour l'auto-suppression par l'utilisateur (Droit à l'effacement).
        - [ ] Définir et implémenter la stratégie de suppression/anonymisation des données associées (commandes, panier abandonné?, etc.).
        - [x] Ajouter endpoint `GET /users/me/export` pour l'export des données utilisateur (Droit à la portabilité).
        - [ ] Revoir/améliorer l'endpoint `GET /users/me` pour inclure toutes les données personnelles pertinentes (Droit d'accès).
    - **Privacy by Design / Sécurité:**
        - [ ] Revoir les données collectées (modèles/schémas) pour minimisation potentielle.
        - [ ] Vérifier/documenter le chiffrement des données au repos (niveau BDD).
        - [ ] Revoir les contrôles d'accès (dépendances FastAPI, rôles) pour s'assurer du moindre privilège.
    - **Plan de réponse aux incidents:**
        - [ ] Mettre en place un système de journalisation (logging) structuré (événements clés: login, reset pwd, suppression compte, erreurs, accès admin).
        - [ ] Définir la politique de journalisation (données à logger, anonymisation si nécessaire, durée de conservation).
    - **Documentation:**
        - [ ] Améliorer les commentaires dans le code pertinent aux fonctionnalités RGPD.
        - [ ] Mettre à jour la documentation externe (README.md, PLAN.md) pour refléter les mesures RGPD.
        - [ ] S'assurer que la nécessité d'une Politique de Confidentialité claire côté frontend est documentée.

7.  **Phase 7: Déploiement & Maintenance (À faire - anciennement Phase 6)**
    - [ ] Mise en place CI/CD.
    - [ ] Déploiement sur un environnement (staging/production).
    - [ ] Monitoring et logging en production.
    - [ ] Maintenance continue, corrections de bugs. 