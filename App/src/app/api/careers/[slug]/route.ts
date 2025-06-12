import { NextResponse } from 'next/server'

/**
 * API pour récupérer une offre d'emploi spécifique par slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Mockdata - Les mêmes offres que dans /api/careers/route.ts
  const jobOffers = [
    {
      id: "1",
      title: "Analyste SOC Senior",
      slug: "analyste-soc-senior",
      description: `Rejoignez notre équipe SOC (Security Operations Center) et participez à la protection de nos clients PME contre les cybermenaces. 

Vous serez responsable de la surveillance en temps réel des infrastructures de nos clients, de l'analyse des alertes de sécurité, et de la réponse aux incidents cyber.

En tant qu'Analyste SOC Senior, vous travaillerez dans un environnement stimulant avec des technologies de pointe et contribuerez directement à la sécurité des entreprises françaises.

Missions principales :
• Surveillance 24h/24 des infrastructures clients via nos outils SIEM
• Analyse et qualification des alertes de sécurité
• Investigation et réponse aux incidents de sécurité
• Rédaction de rapports d'incidents et recommandations
• Formation et encadrement des analystes junior
• Veille sur les nouvelles menaces cybersécurité`,
      requirements: JSON.stringify([
        "Formation cybersécurité (Bac+5) ou équivalent",
        "Expérience SOC/CERT minimum 3 ans",
        "Certifications CySA+, GCIH ou GIAC appréciées",
        "Maîtrise des outils SIEM (Splunk, QRadar, Elastic)",
        "Connaissance des frameworks MITRE ATT&CK",
        "Langages de script (Python, PowerShell)",
        "Anglais technique requis"
      ]),
      advantages: JSON.stringify([
        "Formation continue prise en charge (budget 2000€/an)",
        "Télétravail partiel (2-3 jours/semaine)",
        "Participation aux bénéfices",
        "Mutuelle d'entreprise premium",
        "Budget certifications et conférences",
        "Équipe passionnée et bienveillante",
        "Projets variés et stimulants"
      ]),
      type: "CDI",
      location: "Paris / Télétravail",
      salary: "45-55k€",
      experience: "3-5 ans",
      department: "SOC",
      published: true,
      featured: true,
      urgent: false,
      publishedAt: new Date("2025-01-08"),
      expiresAt: new Date("2025-03-08"),
      createdAt: new Date("2025-01-08"),
      updatedAt: new Date("2025-01-08")
    },
    {
      id: "2",
      title: "Consultant(e) Pentest",
      slug: "consultant-pentest",
      description: `Rejoignez notre équipe de consultants en tests d'intrusion et participez à l'amélioration de la posture sécurité de nos clients.

Vous réaliserez des audits de sécurité complets, des tests d'intrusion sur applications web et infrastructures, et accompagnerez nos clients dans la remédiation des vulnérabilités identifiées.

Ce poste vous offre l'opportunité de travailler sur des projets variés pour des clients de tous secteurs (santé, finance, industrie, secteur public) et de développer votre expertise technique.

Missions principales :
• Tests d'intrusion applicatifs et réseaux
• Audits de configuration et de conformité
• Rédaction de rapports techniques et exécutifs
• Accompagnement client dans la remédiation
• Veille sur les nouvelles vulnérabilités
• Développement d'outils internes de test`,
      requirements: JSON.stringify([
        "Formation sécurité informatique ou équivalent",
        "Expérience tests d'intrusion minimum 2 ans",
        "Certifications OSCP, CEH, GPEN souhaitées",
        "Maîtrise des outils : Burp Suite, Metasploit, Nmap, OWASP ZAP",
        "Connaissance des vulnérabilités OWASP Top 10",
        "Rédaction de rapports techniques en français/anglais",
        "Permis B pour déplacements clients"
      ]),
      advantages: JSON.stringify([
        "Projets techniques variés et stimulants",
        "Formation technique continue",
        "Véhicule de fonction",
        "Prime de mission et frais de déplacement",
        "Certification OSCP financée",
        "Participation aux conférences cyber",
        "Évolution vers expert ou management"
      ]),
      type: "CDI",
      location: "Lyon / Déplacements",
      salary: "42-52k€",
      experience: "2-4 ans",
      department: "Pentest",
      published: true,
      featured: true,
      urgent: true,
      publishedAt: new Date("2025-01-06"),
      expiresAt: new Date("2025-02-28"),
      createdAt: new Date("2025-01-06"),
      updatedAt: new Date("2025-01-06")
    },
    {
      id: "3",
      title: "Responsable Commercial Cybersécurité",
      slug: "responsable-commercial-cybersecurite",
      description: `Développez notre portefeuille client sur la région Sud-Ouest et accompagnez les PME dans leur transformation cybersécurité.

En tant que Responsable Commercial, vous serez l'ambassadeur de Cyna auprès des entreprises de votre secteur géographique. Vous identifierez les besoins cyber de vos prospects, présenterez nos solutions et négocierez les contrats.

Ce poste convient parfaitement à un profil commercial expérimenté souhaitant évoluer dans le domaine porteur de la cybersécurité, avec un excellent potentiel de développement.

Missions principales :
• Prospection et développement commercial sur secteur géographique
• Identification des besoins cybersécurité des PME
• Présentation des solutions Cyna (SOC, Audit, Pentest, CERT)
• Négociation et closing des contrats
• Suivi et fidélisation du portefeuille client
• Participation aux salons et événements professionnels`,
      requirements: JSON.stringify([
        "Formation commerciale, technique ou double compétence",
        "Expérience vente BtoB en IT/cybersécurité (5+ ans)",
        "Connaissance du marché cybersécurité PME",
        "Excellent relationnel et capacité de conviction",
        "Autonomie et organisation exemplaires",
        "Permis B obligatoire",
        "Maîtrise des outils CRM"
      ]),
      advantages: JSON.stringify([
        "Variable attractif (jusqu'à 30% du fixe)",
        "Secteur géographique défini et protégé",
        "Formation complète aux produits Cyna",
        "Véhicule de fonction",
        "Évolution management équipe",
        "Participation aux événements professionnels",
        "Marché en forte croissance"
      ]),
      type: "CDI",
      location: "Toulouse / Régional",
      salary: "50-65k€ + variable",
      experience: "5+ ans",
      department: "Commercial",
      published: true,
      featured: false,
      urgent: false,
      publishedAt: new Date("2025-01-05"),
      expiresAt: new Date("2025-04-05"),
      createdAt: new Date("2025-01-05"),
      updatedAt: new Date("2025-01-05")
    },
    {
      id: "4",
      title: "Ingénieur DevSecOps",
      slug: "ingenieur-devsecops",
      description: `Rejoignez notre équipe infrastructure et participez à la sécurisation de nos plateformes et de celles de nos clients.

Vous travaillerez sur l'intégration de la sécurité dans nos pipelines de développement, l'automatisation des contrôles sécurité, et l'amélioration continue de notre posture sécurité interne.

Ce poste est idéal pour un profil technique passionné par l'intersection entre développement, opérations et sécurité, avec un goût pour l'automatisation et les bonnes pratiques.

Missions principales :
• Intégration de la sécurité dans les pipelines CI/CD
• Automatisation des tests de sécurité et conformité
• Gestion et sécurisation de l'infrastructure cloud
• Monitoring et alerting sécurité des applications
• Formation des équipes de développement
• Veille technologique DevSecOps`,
      requirements: JSON.stringify([
        "Formation ingénieur informatique ou équivalent",
        "Expérience DevOps/SRE avec focus sécurité (3+ ans)",
        "Maîtrise Docker, Kubernetes, Terraform",
        "Connaissance des outils SAST/DAST (SonarQube, OWASP ZAP)",
        "Scripts Python, Bash, PowerShell",
        "Cloud AWS/Azure avec sécurité",
        "Méthologies Agile/Scrum"
      ]),
      advantages: JSON.stringify([
        "Stack technique moderne et évolutive",
        "Projets d'innovation et R&D",
        "Formation cloud et certifications",
        "Télétravail flexible",
        "Environnement startup dans grand groupe",
        "Budget conférences DevSecOps",
        "Évolution architect ou lead tech"
      ]),
      type: "CDI",
      location: "Remote / France",
      salary: "48-58k€",
      experience: "3+ ans",
      department: "R&D",
      published: true,
      featured: false,
      urgent: false,
      publishedAt: new Date("2025-01-04"),
      expiresAt: new Date("2025-03-31"),
      createdAt: new Date("2025-01-04"),
      updatedAt: new Date("2025-01-04")
    },
    {
      id: "5",
      title: "Stage - Assistant(e) SOC",
      slug: "stage-assistant-soc",
      description: `Découvrez le monde de la cybersécurité opérationnelle au sein de notre SOC (Security Operations Center).

Ce stage vous permettra d'appréhender les métiers de la cybersécurité, de vous former aux outils professionnels et de contribuer à la protection de nos clients PME.

Vous serez encadré(e) par nos analystes seniors et participerez aux missions quotidiennes du SOC avec un programme de formation structuré.

Missions principales :
• Participation à la surveillance des infrastructures clients
• Analyse de premier niveau des alertes de sécurité
• Rédaction de documentations et procédures
• Support aux investigations d'incidents
• Participation aux formations internes
• Projet de fin de stage sur amélioration processus`,
      requirements: JSON.stringify([
        "Formation cybersécurité, réseaux ou informatique (Bac+3 à Bac+5)",
        "Connaissances de base en sécurité informatique",
        "Notions de réseaux et systèmes",
        "Curiosité pour la cybersécurité",
        "Capacité d'analyse et de synthèse",
        "Français et anglais technique",
        "Disponibilité 4-6 mois"
      ]),
      advantages: JSON.stringify([
        "Formation complète aux métiers SOC",
        "Encadrement par experts certifiés",
        "Gratification de stage attractive",
        "Possibilité d'embauche à l'issue",
        "Accès aux outils professionnels",
        "Participation aux réunions d'équipe",
        "Lettre de recommandation"
      ]),
      type: "STAGE",
      location: "Paris / Télétravail partiel",
      salary: "Gratification conventionnelle",
      experience: "Débutant",
      department: "SOC",
      published: true,
      featured: false,
      urgent: false,
      publishedAt: new Date("2025-01-03"),
      expiresAt: new Date("2025-02-15"),
      createdAt: new Date("2025-01-03"),
      updatedAt: new Date("2025-01-03")
    }
  ]

  // Recherche de l'offre par slug
  const jobOffer = jobOffers.find(offer => offer.slug === slug && offer.published)

  if (!jobOffer) {
    return NextResponse.json({
      success: false,
      error: 'Offre d\'emploi non trouvée'
    }, { status: 404 })
  }

  // Offres similaires (même département)
  const relatedJobs = jobOffers
    .filter(offer => 
      offer.department === jobOffer.department && 
      offer.id !== jobOffer.id && 
      offer.published
    )
    .slice(0, 3)

  return NextResponse.json({
    success: true,
    data: {
      jobOffer,
      relatedJobs
    }
  })
} 