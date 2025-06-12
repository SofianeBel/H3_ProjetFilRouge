import { Metadata } from "next"
import { BookOpen, Download, FileText, Video, Shield, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation et ressources cybersécurité | Cyna",
  description: "Guides pratiques, documentation technique et ressources cybersécurité pour améliorer votre posture sécuritaire. Experts Cyna.",
}

/**
 * Page documentation - Centre de ressources cybersécurité
 * Guides, documentation technique et ressources pratiques
 */
export default function DocsPage() {
  // Catégories de documentation
  const docCategories = [
    {
      title: "Guides pratiques",
      icon: BookOpen,
      color: "blue",
      description: "Guides étape par étape pour améliorer votre sécurité",
      count: 12
    },
    {
      title: "Fiches techniques",
      icon: FileText,
      color: "green",
      description: "Documentation technique détaillée",
      count: 8
    },
    {
      title: "Webinaires",
      icon: Video,
      color: "purple",
      description: "Formations vidéo et conférences",
      count: 15
    },
    {
      title: "Outils gratuits",
      icon: Download,
      color: "orange",
      description: "Outils et checklist téléchargeables",
      count: 6
    }
  ]

  // Documents populaires
  const popularDocs = [
    {
      title: "Guide de démarrage cybersécurité PME",
      type: "PDF",
      category: "Guide pratique",
      downloads: "2.3k",
      description: "Les 10 premières mesures de sécurité à mettre en place dans votre PME",
      badge: "Gratuit",
      badgeColor: "green"
    },
    {
      title: "Checklist audit sécurité interne",
      type: "PDF",
      category: "Outil",
      downloads: "1.8k",
      description: "Liste de vérification pour évaluer votre posture sécurité",
      badge: "Gratuit",
      badgeColor: "green"
    },
    {
      title: "Plan de réponse aux incidents",
      type: "Template",
      category: "Modèle",
      downloads: "1.5k",
      description: "Modèle de plan de gestion de crise cyber personnalisable",
      badge: "Premium",
      badgeColor: "purple"
    },
    {
      title: "Formation sensibilisation phishing",
      type: "Vidéo",
      category: "Formation",
      downloads: "3.2k",
      description: "Module de formation pour sensibiliser vos équipes",
      badge: "Gratuit",
      badgeColor: "green"
    }
  ]

  // Ressources par thème
  const themeResources = [
    {
      theme: "Protection des données",
      icon: Shield,
      resources: [
        "Guide RGPD pour les PME",
        "Matrice des risques données",
        "Procédures de sauvegarde",
        "Gestion des accès utilisateurs"
      ]
    },
    {
      theme: "Sécurité réseau",
      icon: Shield,
      resources: [
        "Configuration firewall",
        "Segmentation réseau",
        "Monitoring du trafic",
        "VPN et accès distant"
      ]
    },
    {
      theme: "Formation équipes",
      icon: BookOpen,
      resources: [
        "Kit sensibilisation cyber",
        "Quiz sécurité informatique",
        "Bonnes pratiques bureautique",
        "Gestion des mots de passe"
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Documentation</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Centre de ressources
              <span className="block text-[#A67FFB]">cybersécurité</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Guides pratiques, documentation technique et outils gratuits 
              pour améliorer la sécurité de votre organisation.
            </p>
            
            {/* Barre de recherche */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la documentation..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A67FFB] backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Catégories de documentation */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Explorez nos ressources
            </h2>
            <p className="text-xl text-gray-600">
              Documentation organisée par catégorie pour répondre à vos besoins
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {docCategories.map((category, index) => {
              const IconComponent = category.icon
              const colorClasses: Record<string, string> = {
                blue: "from-blue-500 to-blue-600 text-blue-600",
                green: "from-green-500 to-green-600 text-green-600",
                purple: "from-purple-500 to-purple-600 text-purple-600",
                orange: "from-orange-500 to-orange-600 text-orange-600"
              }
              
              const colorClass = colorClasses[category.color] || colorClasses.blue
              const [gradientFrom, gradientTo, textColor] = colorClass.split(' ')
              
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
                  <div className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#161A22] mb-2">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${textColor}`}>
                      {category.count} ressources
                    </span>
                    <button className={`text-sm font-medium ${textColor} hover:underline`}>
                      Voir tout →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Documents populaires */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Ressources les plus téléchargées
            </h2>
            <p className="text-xl text-gray-600">
              Les documents préférés de notre communauté
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {popularDocs.map((doc, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#A67FFB]/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#A67FFB]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{doc.category}</div>
                      <div className="text-xs text-gray-400">{doc.type}</div>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doc.badgeColor === 'green' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {doc.badge}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-[#161A22] mb-2">
                  {doc.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {doc.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Download className="h-4 w-4" />
                    {doc.downloads} téléchargements
                  </div>
                  
                  <button className="bg-[#A67FFB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ressources par thème */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Ressources par thématique
            </h2>
            <p className="text-xl text-gray-600">
              Documentation organisée par domaines d'expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {themeResources.map((theme, index) => {
              const IconComponent = theme.icon
              return (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#A67FFB] rounded-xl flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#161A22]">
                      {theme.theme}
                    </h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {theme.resources.map((resource, resourceIndex) => (
                      <li key={resourceIndex} className="flex items-center gap-3 text-gray-700 hover:text-[#A67FFB] cursor-pointer transition-colors">
                        <div className="w-2 h-2 bg-[#A67FFB] rounded-full"></div>
                        <span className="text-sm">{resource}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className="mt-6 text-[#A67FFB] font-medium text-sm hover:underline">
                    Voir toutes les ressources →
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter et support */}
      <section className="py-20 bg-[#161A22]">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Restez informé des nouveautés
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Recevez nos dernières ressources, guides et actualités cybersécurité 
                directement dans votre boîte mail.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A67FFB]"
                />
                <button className="btn-primary whitespace-nowrap">
                  S'abonner
                </button>
              </div>
              
              <p className="text-gray-400 text-sm mt-3">
                Pas de spam, désabonnement en un clic
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Besoin d'aide ?
              </h3>
              <p className="text-gray-300 mb-6">
                Nos experts sont disponibles pour vous accompagner dans l'utilisation 
                de nos ressources et répondre à vos questions.
              </p>
              
              <div className="space-y-3">
                <a href="mailto:support@cyna.fr" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-[#A67FFB] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">@</span>
                  </div>
                  support@cyna.fr
                </a>
                
                <a href="tel:+33123456789" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-[#A67FFB] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📞</span>
                  </div>
                  +33 (0)1 23 45 67 89
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 