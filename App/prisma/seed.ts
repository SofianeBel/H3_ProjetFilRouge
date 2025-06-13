import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Démarrage du seed...')

  // Création d'un utilisateur admin par défaut
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cyna.fr' },
    update: {},
    create: {
      id: 'admin-cyna-001',
      email: 'admin@cyna.fr',
      name: 'Équipe Cyna',
      role: 'ADMIN',
      image: 'https://ui-avatars.com/api/?name=Cyna+Admin&background=6B8DE5&color=ffffff',
    },
  })

  console.log('✅ Utilisateur admin créé:', adminUser.email)

  // Création des catégories de blog
  const categories = [
    {
      name: 'Actualités Cyber',
      slug: 'actualites-cyber',
      description: 'Les dernières actualités en cybersécurité',
      color: '#6B8DE5',
    },
    {
      name: 'SOC Managé',
      slug: 'soc-manage',
      description: 'Conseils et retours d\'expérience sur les SOC managés',
      color: '#8E63E5',
    },
    {
      name: 'Pentest & Audit',
      slug: 'pentest-audit',
      description: 'Méthodologies et découvertes lors des tests de pénétration',
      color: '#A67FFB',
    },
    {
      name: 'Gestion d\'Incidents',
      slug: 'gestion-incidents',
      description: 'Procédures et bonnes pratiques en gestion d\'incidents',
      color: '#FF6B6B',
    },
    {
      name: 'Conformité',
      slug: 'conformite',
      description: 'Réglementations et conformité en cybersécurité',
      color: '#4ECDC4',
    },
  ]

  const createdCategories = []
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    })
    createdCategories.push(category)
    console.log('✅ Catégorie créée:', category.name)
  }

  // Création d'articles de blog d'exemple
  const blogPosts = [
    {
      title: 'Les nouvelles menaces de 2024 : Intelligence Artificielle et Cybersécurité',
      slug: 'nouvelles-menaces-2024-ia-cybersecurite',
      excerpt: 'Découvrez comment l\'intelligence artificielle transforme le paysage des menaces cybernétiques et les stratégies de défense adaptées.',
      content: `L'année 2024 marque un tournant dans l'évolution des cybermenaces. L'adoption massive de l'intelligence artificielle par les cybercriminels ouvre de nouveaux vecteurs d'attaque particulièrement sophistiqués.

Les attaquants utilisent désormais des algorithmes d'apprentissage automatique pour automatiser la reconnaissance et l'identification de vulnérabilités, générer du contenu de phishing ultra-réaliste, contourner les systèmes de détection traditionnels et personnaliser les attaques à grande échelle.

Cette évolution nécessite une adaptation profonde des Security Operations Centers. Chez Cyna, nous avons développé des approches hybrides combinant expertise humaine et intelligence artificielle défensive.

Face à ces nouvelles menaces, plusieurs approches s'avèrent efficaces : la détection comportementale avancée, la réponse automatisée intelligente et la formation continue des équipes.

L'évolution du paysage des menaces en 2024 confirme l'importance d'avoir un SOC managé capable de s'adapter rapidement.`,
      categoryId: createdCategories.find(c => c.slug === 'actualites-cyber')?.id,
      authorId: adminUser.id,
      published: true,
      featured: true,
      readTime: 8,
      metaTitle: 'Nouvelles menaces 2024 : IA et Cybersécurité | Blog Cyna',
      metaDescription: 'Analyse des nouvelles menaces cybernétiques liées à l\'IA en 2024 et stratégies de défense adaptées par nos experts SOC.',
      coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
      tags: JSON.stringify(['IA', 'Menaces', '2024', 'SOC', 'Défense']),
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'Guide complet du SOC managé : Avantages et mise en œuvre',
      slug: 'guide-complet-soc-manage-avantages-mise-en-oeuvre',
      excerpt: 'Un guide détaillé pour comprendre les bénéfices d\'un SOC managé et les étapes clés pour une implémentation réussie.',
      content: `Un Security Operations Center (SOC) managé est un service externalisé qui assure la surveillance continue de votre infrastructure de sécurité. Cette approche permet aux entreprises de bénéficier d'une expertise de haut niveau sans les coûts et complexités d'un SOC interne.

Les composants essentiels incluent le monitoring 24/7/365, l'analyse des logs, la détection des menaces, la réponse aux incidents et le reporting détaillé.

L'expertise immédiate, la réduction des coûts et l'optimisation du temps de réaction constituent les principaux avantages. Notre équipe garantit un temps de réaction moyen de 15 minutes pour les incidents critiques.

La mise en œuvre se déroule en 4 phases : audit initial, déploiement des capteurs, intégration et tests, puis surveillance opérationnelle.

Chez Cyna, nous nous engageons sur des indicateurs précis : MTTD < 10 minutes, MTTR < 15 minutes, disponibilité 99.9% et taux de faux positifs < 5%.`,
      categoryId: createdCategories.find(c => c.slug === 'soc-manage')?.id,
      authorId: adminUser.id,
      published: true,
      featured: false,
      readTime: 12,
      metaTitle: 'Guide SOC Managé : Avantages et Implémentation | Cyna',
      metaDescription: 'Découvrez les avantages d\'un SOC managé et notre méthodologie d\'implémentation éprouvée pour sécuriser votre entreprise.',
      coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
      tags: JSON.stringify(['SOC', 'Managed', 'Security', 'Implementation', 'Guide']),
      publishedAt: new Date('2024-01-20'),
    },
    {
      title: 'Méthodologie de test de pénétration : Approche par phases',
      slug: 'methodologie-test-penetration-approche-phases',
      excerpt: 'Découvrez notre méthodologie structurée pour conduire des tests de pénétration efficaces et exhaustifs.',
      content: `
        <h2>Introduction au Pentest</h2>
        <p>Les tests de pénétration constituent un élément fondamental de toute stratégie de cybersécurité. Notre méthodologie éprouvée garantit une couverture exhaustive des vulnérabilités potentielles.</p>
        
        <h2>Phase 1 : Reconnaissance et collecte d'informations</h2>
        
        <h3>Reconnaissance passive</h3>
        <ul>
          <li>Analyse OSINT (Open Source Intelligence)</li>
          <li>Cartographie des domaines et sous-domaines</li>
          <li>Identification des technologies utilisées</li>
          <li>Recherche d'informations sur les employés</li>
        </ul>
        
        <h3>Reconnaissance active</h3>
        <ul>
          <li>Scan de ports et services</li>
          <li>Énumération des services</li>
          <li>Fingerprinting des applications</li>
          <li>Identification des versions logicielles</li>
        </ul>
        
        <h2>Phase 2 : Analyse des vulnérabilités</h2>
        
        <h3>Scan automatisé</h3>
        <p>Utilisation d'outils spécialisés pour identifier les vulnérabilités connues :</p>
        <ul>
          <li>Nessus, OpenVAS pour les vulnérabilités système</li>
          <li>OWASP ZAP, Burp Suite pour les applications web</li>
          <li>Nmap avec scripts NSE pour l'énumération avancée</li>
        </ul>
        
        <h3>Analyse manuelle</h3>
        <p>Validation et approfondissement par nos experts :</p>
        <ul>
          <li>Vérification des faux positifs</li>
          <li>Recherche de vulnérabilités logiques</li>
          <li>Test de configurations spécifiques</li>
        </ul>
        
        <h2>Phase 3 : Exploitation contrôlée</h2>
        
        <h3>Priorisation des vulnérabilités</h3>
        <p>Classification selon la matrice CVSS et l'impact métier :</p>
        <ul>
          <li>Critique : Accès administrateur ou données sensibles</li>
          <li>Élevé : Accès utilisateur ou déni de service</li>
          <li>Moyen : Fuite d'informations limitée</li>
          <li>Faible : Vulnérabilités nécessitant des conditions spécifiques</li>
        </ul>
        
        <h3>Exploitation sécurisée</h3>
        <p>Tests d'exploitation en environnement contrôlé pour valider l'impact réel.</p>
        
        <h2>Phase 4 : Post-exploitation et persistance</h2>
        
        <h3>Élévation de privilèges</h3>
        <p>Test de progression dans le système compromis :</p>
        <ul>
          <li>Recherche de chemins d'escalade</li>
          <li>Exploitation de configurations faibles</li>
          <li>Test de mouvement latéral</li>
        </ul>
        
        <h3>Évaluation de l'impact</h3>
        <p>Mesure précise des données accessibles et des systèmes compromis.</p>
        
        <h2>Phase 5 : Reporting et recommandations</h2>
        
        <h3>Rapport exécutif</h3>
        <p>Synthèse destinée à la direction avec :</p>
        <ul>
          <li>Niveau de risque global</li>
          <li>Impact métier potentiel</li>
          <li>Recommandations prioritaires</li>
          <li>Feuille de route sécurité</li>
        </ul>
        
        <h3>Rapport technique détaillé</h3>
        <p>Documentation complète pour les équipes techniques :</p>
        <ul>
          <li>Procédures de reproduction</li>
          <li>Preuves de concept (PoC)</li>
          <li>Correctifs spécifiques</li>
          <li>Mesures de protection</li>
        </ul>
        
        <h2>Suivi et retest</h2>
        <p>Accompagnement dans la remediation avec tests de validation des correctifs appliqués.</p>
        
        <h2>Conclusion</h2>
        <p>Cette méthodologie structurée garantit une évaluation complète et objective de votre posture de sécurité. Nos experts certifiés CEH, OSCP et CISSP mettent leur expertise au service de votre sécurité.</p>
      `,
      categoryId: createdCategories.find(c => c.slug === 'pentest-audit')?.id,
      authorId: adminUser.id,
      published: true,
      featured: false,
      readTime: 15,
      metaTitle: 'Méthodologie Test de Pénétration : Guide Expert | Cyna',
      metaDescription: 'Découvrez notre méthodologie structurée de test de pénétration en 5 phases pour une évaluation sécurité complète.',
      coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
      tags: JSON.stringify(['Pentest', 'Méthodologie', 'Sécurité', 'Vulnérabilités', 'Audit']),
      publishedAt: new Date('2024-01-25'),
    },
    {
      title: 'Gestion d\'incident de sécurité : Playbook de réponse rapide',
      slug: 'gestion-incident-securite-playbook-reponse-rapide',
      excerpt: 'Notre playbook éprouvé pour une gestion efficace des incidents de sécurité, de la détection à la remédiation.',
      content: `
        <h2>L'importance d'un playbook structuré</h2>
        <p>La gestion d'incidents de sécurité nécessite une approche méthodique et rapide. Notre playbook de réponse garantit une coordination optimale des équipes et une résolution efficace.</p>
        
        <h2>Phase 1 : Détection et alerte (0-15 minutes)</h2>
        
        <h3>Sources de détection</h3>
        <ul>
          <li>Systèmes SIEM et corrélation d'événements</li>
          <li>Sondes réseau et IDS/IPS</li>
          <li>Antivirus et EDR sur les postes</li>
          <li>Rapports utilisateurs</li>
          <li>Sources externes (CERT, threat intelligence)</li>
        </ul>
        
        <h3>Procédure d'alerte</h3>
        <ol>
          <li>Réception de l'alerte par l'analyste SOC de niveau 1</li>
          <li>Qualification initiale selon la matrice de criticité</li>
          <li>Escalade automatique selon les seuils définis</li>
          <li>Notification des parties prenantes</li>
        </ol>
        
        <h2>Phase 2 : Identification et classification (15-45 minutes)</h2>
        
        <h3>Analyse technique approfondie</h3>
        <ul>
          <li>Corrélation avec les événements récents</li>
          <li>Analyse des indicateurs de compromission (IoC)</li>
          <li>Identification de l'ampleur de l'incident</li>
          <li>Évaluation de l'impact métier potentiel</li>
        </ul>
        
        <h3>Classification de l'incident</h3>
        <p>Catégorisation selon notre matrice :</p>
        <ul>
          <li><strong>P1 - Critique</strong> : Impact métier majeur, données sensibles compromises</li>
          <li><strong>P2 - Élevé</strong> : Compromission confirmée, impact métier modéré</li>
          <li><strong>P3 - Moyen</strong> : Tentative d'intrusion, pas d'impact immédiat</li>
          <li><strong>P4 - Faible</strong> : Anomalie détectée, investigation requise</li>
        </ul>
        
        <h2>Phase 3 : Containment et éradication (45 minutes - 4 heures)</h2>
        
        <h3>Mesures de confinement immédiat</h3>
        <ul>
          <li>Isolement des systèmes compromis</li>
          <li>Blocage des adresses IP malveillantes</li>
          <li>Désactivation des comptes utilisateur suspectés</li>
          <li>Sauvegarde des preuves numériques</li>
        </ul>
        
        <h3>Éradication de la menace</h3>
        <ul>
          <li>Suppression des malwares identifiés</li>
          <li>Fermeture des vecteurs d'attaque</li>
          <li>Application des correctifs de sécurité</li>
          <li>Renforcement des mesures de protection</li>
        </ul>
        
        <h2>Phase 4 : Récupération et surveillance (4-24 heures)</h2>
        
        <h3>Restauration des services</h3>
        <ol>
          <li>Validation de l'intégrité des systèmes</li>
          <li>Restauration graduelle des services</li>
          <li>Surveillance renforcée des indicateurs</li>
          <li>Tests de fonctionnement complets</li>
        </ol>
        
        <h3>Surveillance post-incident</h3>
        <p>Monitoring intensif pendant 72 heures minimum pour détecter toute résurgence.</p>
        
        <h2>Phase 5 : Lessons learned et amélioration continue</h2>
        
        <h3>Post-mortem structuré</h3>
        <ul>
          <li>Chronologie détaillée de l'incident</li>
          <li>Analyse des causes racines</li>
          <li>Évaluation de l'efficacité de la réponse</li>
          <li>Identification des points d'amélioration</li>
        </ul>
        
        <h3>Plan d'amélioration</h3>
        <ul>
          <li>Mise à jour des procédures</li>
          <li>Renforcement des contrôles</li>
          <li>Formation complémentaire des équipes</li>
          <li>Évolution des outils de détection</li>
        </ul>
        
        <h2>Rôles et responsabilités</h2>
        
        <h3>Incident Manager</h3>
        <p>Coordination générale, communication avec la direction, prise de décision stratégique.</p>
        
        <h3>Analyste SOC</h3>
        <p>Investigation technique, analyse des logs, identification des indicateurs.</p>
        
        <h3>Expert en réponse à incident</h3>
        <p>Forensic, analyse malware, coordination technique des mesures de confinement.</p>
        
        <h3>Communication Manager</h3>
        <p>Communication interne/externe, relation avec les autorités, gestion de la réputation.</p>
        
        <h2>Métriques de performance</h2>
        <ul>
          <li>MTTD (Mean Time To Detect) : &lt; 10 minutes</li>
          <li>MTTI (Mean Time To Investigate) : &lt; 30 minutes</li>
          <li>MTTC (Mean Time To Contain) : &lt; 2 heures</li>
          <li>MTTR (Mean Time To Recover) : &lt; 24 heures</li>
        </ul>
        
        <h2>Outils essentiels</h2>
        <ul>
          <li>Plateforme SIEM centralisée</li>
          <li>Solutions EDR sur les endpoints</li>
          <li>Outils de forensic et d'analyse</li>
          <li>Sandbox pour analyse de malwares</li>
          <li>Plateforme de communication d'urgence</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Un playbook bien rodé et des équipes formées constituent les fondements d'une réponse efficace aux incidents. Nos experts SOC mettent cette expertise à votre service 24/7.</p>
      `,
      categoryId: createdCategories.find(c => c.slug === 'gestion-incidents')?.id,
      authorId: adminUser.id,
      published: true,
      featured: false,
      readTime: 18,
      metaTitle: 'Playbook Gestion d\'Incident Sécurité : Guide Expert | Cyna',
      metaDescription: 'Découvrez notre playbook éprouvé de gestion d\'incidents de sécurité en 5 phases pour une réponse rapide et efficace.',
      coverImage: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=400&fit=crop',
      tags: JSON.stringify(['Incident', 'Response', 'Playbook', 'SOC', 'Emergency']),
      publishedAt: new Date('2024-02-01'),
    },
  ]

  // Création des articles
  for (const postData of blogPosts) {
    const post = await prisma.blogPost.upsert({
      where: { slug: postData.slug },
      update: postData,
      create: postData,
    })
    console.log('✅ Article créé:', post.title)
  }

  // Création des services de cybersécurité
  console.log('🔧 Création des services...')
  
  const services = [
    {
      name: 'SOC 24/7',
      slug: 'soc',
      description: 'Surveillance continue de votre infrastructure par nos experts certifiés. Détection et réponse aux incidents en temps réel.',
      longDescription: `
        ## Service SOC 24/7 - Security Operations Center
        
        Notre SOC (Security Operations Center) offre une surveillance continue de votre infrastructure informatique, 24 heures sur 24 et 7 jours sur 7.
        
        ### Fonctionnalités incluses
        - Monitoring en temps réel de votre infrastructure
        - Analyse comportementale avancée avec IA
        - Réponse aux incidents sous 15 minutes
        - Rapports mensuels détaillés
        - Équipe d'experts certifiés disponible 24/7
        
        ### Technologies utilisées
        - SIEM de dernière génération
        - Intelligence artificielle pour la détection d'anomalies
        - Corrélation d'événements multi-sources
        - Threat intelligence en temps réel
      `,
      price: 299000, // 2990€ en centimes
      currency: 'eur',
      purchaseType: 'PRE_CONFIGURED',
      stripeProductId: null, // À remplir après création dans Stripe
      stripePriceId: null,   // À remplir après création dans Stripe
      published: true,
      featured: true,
      category: 'Surveillance',
      icon: 'Eye',
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Audit de Sécurité',
      slug: 'audit',
      description: 'Analyse approfondie de votre posture de sécurité avec identification des vulnérabilités et plan d\'amélioration.',
      longDescription: `
        ## Audit de Sécurité Complet
        
        Notre audit de sécurité offre une évaluation complète de votre posture de sécurité informatique.
        
        ### Ce qui est inclus
        - Audit technique complet de l'infrastructure
        - Analyse des configurations système
        - Tests de conformité RGPD
        - Plan de remédiation prioritisé
        - Rapport exécutif et technique
        
        ### Méthodologie
        - Approche basée sur les standards NIST et ISO 27001
        - Tests automatisés et manuels
        - Analyse des vulnérabilités
        - Évaluation des risques métier
      `,
      price: null, // Sur devis
      currency: 'eur',
      purchaseType: 'QUOTE',
      stripeProductId: null,
      stripePriceId: null,
      published: true,
      featured: true,
      category: 'Audit',
      icon: 'Shield',
      color: 'from-green-500 to-blue-600'
    },
    {
      name: 'Tests d\'Intrusion',
      slug: 'pentest',
      description: 'Simulations d\'attaques réelles pour tester la robustesse de vos défenses et identifier les failles critiques.',
      longDescription: `
        ## Tests d'Intrusion (Pentest)
        
        Nos tests d'intrusion simulent des attaques réelles pour évaluer la sécurité de vos systèmes.
        
        ### Types de tests
        - Pentest applicatif (web, mobile)
        - Pentest réseau et infrastructure
        - Tests d'ingénierie sociale
        - Simulation d'attaques avancées (Red Team)
        
        ### Livrables
        - Rapport exécutif pour la direction
        - Rapport technique détaillé
        - Preuves de concept (PoC)
        - Plan de remédiation prioritisé
      `,
      price: null, // Sur devis
      currency: 'eur',
      purchaseType: 'QUOTE',
      stripeProductId: null,
      stripePriceId: null,
      published: true,
      featured: true,
      category: 'Pentest',
      icon: 'AlertTriangle',
      color: 'from-red-500 to-orange-600'
    },
    {
      name: 'CERT',
      slug: 'cert',
      description: 'Équipe spécialisée dans la réponse aux incidents de sécurité et la gestion de crise cyber.',
      longDescription: `
        ## CERT - Computer Emergency Response Team
        
        Notre équipe CERT intervient en urgence pour gérer les incidents de sécurité.
        
        ### Services d'urgence
        - Réponse d'urgence 24h/7j
        - Investigation forensique
        - Containment et éradication
        - Accompagnement post-incident
        
        ### Expertise
        - Analystes certifiés en forensic
        - Spécialistes en réponse à incident
        - Coordination avec les autorités
        - Communication de crise
      `,
      price: null, // Sur devis
      currency: 'eur',
      purchaseType: 'QUOTE',
      stripeProductId: null,
      stripePriceId: null,
      published: true,
      featured: false,
      category: 'Incident Response',
      icon: 'Users',
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Formation Cybersécurité',
      slug: 'formation',
      description: 'Programmes de formation adaptés pour sensibiliser vos équipes aux enjeux de cybersécurité.',
      longDescription: `
        ## Formation Cybersécurité
        
        Nos programmes de formation renforcent la culture sécurité de votre organisation.
        
        ### Modules disponibles
        - Sensibilisation générale à la cybersécurité
        - Phishing et ingénierie sociale
        - Gestion des mots de passe
        - Sécurité du télétravail
        - Conformité RGPD
        
        ### Formats
        - Sessions en présentiel ou distanciel
        - E-learning interactif
        - Simulations d'attaques
        - Évaluations et certifications
      `,
      price: 149000, // 1490€ en centimes
      currency: 'eur',
      purchaseType: 'PRE_CONFIGURED',
      stripeProductId: null,
      stripePriceId: null,
      published: true,
      featured: false,
      category: 'Formation',
      icon: 'GraduationCap',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      name: 'Conformité RGPD',
      slug: 'compliance',
      description: 'Accompagnement complet pour la mise en conformité RGPD et le maintien de votre conformité.',
      longDescription: `
        ## Conformité RGPD
        
        Accompagnement complet pour votre mise en conformité RGPD.
        
        ### Services inclus
        - Audit de conformité RGPD
        - Cartographie des traitements
        - Rédaction des politiques et procédures
        - Formation des équipes
        - Accompagnement DPO
        
        ### Livrables
        - Registre des traitements
        - Analyses d'impact (AIPD)
        - Procédures de gestion des droits
        - Plan de mise en conformité
      `,
      price: null, // Sur devis
      currency: 'eur',
      purchaseType: 'QUOTE',
      stripeProductId: null,
      stripePriceId: null,
      published: true,
      featured: false,
      category: 'Conformité',
      icon: 'FileCheck',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      name: 'Gestion des Incidents',
      slug: 'incident',
      description: 'Service de gestion proactive des incidents de sécurité avec intervention rapide.',
      longDescription: `
        ## Gestion des Incidents de Sécurité
        
        Service complet de gestion des incidents de sécurité informatique.
        
        ### Processus structuré
        - Détection et alerte immédiate
        - Classification et priorisation
        - Containment et éradication
        - Récupération et surveillance
        - Post-mortem et amélioration
        
        ### Garanties de service
        - Temps de réponse < 15 minutes
        - Équipe d'experts disponible 24/7
        - Coordination avec vos équipes
        - Reporting en temps réel
      `,
      price: 199000, // 1990€ en centimes
      currency: 'eur',
      purchaseType: 'PRE_CONFIGURED',
      stripeProductId: null,
      stripePriceId: null,
      published: true,
      featured: false,
      category: 'Incident Response',
      icon: 'AlertCircle',
      color: 'from-orange-500 to-red-600'
    }
  ]

  // Création des services
  for (const serviceData of services) {
    const service = await prisma.service.upsert({
      where: { slug: serviceData.slug },
      update: serviceData,
      create: serviceData,
    })
    console.log('✅ Service créé:', service.name)
  }

  console.log('🎉 Seed terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 