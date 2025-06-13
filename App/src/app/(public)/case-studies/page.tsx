import { Metadata } from "next"
import { Building2, TrendingUp, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Études de cas cybersécurité | Succès clients Cyna",
  description: "Découvrez nos études de cas cybersécurité. Témoignages clients, résultats concrets et transformations réussies avec les solutions Cyna.",
}

/**
 * Page études de cas - Témoignages et réussites clients
 * Showcase des projets réalisés et des résultats obtenus
 */
export default function CaseStudiesPage() {
  // Études de cas principales
  const caseStudies = [
    {
      company: "TechMed Solutions",
      sector: "Santé",
      size: "120 employés",
      challenge: "Mise en conformité HDS et protection des données patients",
      solution: "Déploiement SOC + Audit HDS + Formation équipes",
      results: [
        "Certification HDS obtenue en 6 mois",
        "0 incident de sécurité depuis 18 mois",
        "Conformité RGPD santé assurée",
        "ROI de 340% sur 2 ans"
      ],
      testimonial: "Grâce à Cyna, nous avons sécurisé nos données patients et obtenu notre certification HDS. L'équipe est réactive et compétente.",
      author: "Dr. Marie Laurent",
      position: "DSI, TechMed Solutions",
      image: "/case-studies/techmed.jpg",
      tags: ["HDS", "Santé", "RGPD"],
      duration: "6 mois",
      featured: true
    },
    {
      company: "InnovFactory",
      sector: "Industrie 4.0",
      size: "85 employés",
      challenge: "Sécurisation des systèmes industriels connectés (IoT)",
      solution: "Audit sécurité + Segmentation réseau + Monitoring 24/7",
      results: [
        "Réduction de 95% des vulnérabilités",
        "Détection proactive des menaces",
        "Continuité de production assurée",
        "Économies de 180k€ évitées"
      ],
      testimonial: "Cyna a sécurisé notre industrie 4.0 sans impacter notre production. Leur expertise IoT est remarquable.",
      author: "Thomas Dubois",
      position: "Directeur Technique, InnovFactory",
      image: "/case-studies/innovfactory.jpg",
      tags: ["IoT", "Industrie", "OT"],
      duration: "4 mois",
      featured: true
    },
    {
      company: "Conseil Municipal de Beaumont",
      sector: "Secteur Public",
      size: "200 agents",
      challenge: "Conformité ANSSI et sécurisation des services publics",
      solution: "SOC mutualisé + Formation + Audit conformité",
      results: [
        "Conformité ANSSI validée",
        "Services publics numériques sécurisés",
        "Formation de 200 agents",
        "Cyberscore excellent obtenu"
      ],
      testimonial: "La solution SOC mutualisée nous permet d'accéder à une cybersécurité de niveau expert avec un budget maîtrisé.",
      author: "Catherine Moreau",
      position: "DSI, Ville de Beaumont",
      image: "/case-studies/beaumont.jpg",
      tags: ["Public", "ANSSI", "Mutualisé"],
      duration: "8 mois",
      featured: false
    },
    {
      company: "FinanceSecure",
      sector: "Finance",
      size: "45 employés",
      challenge: "Protection contre les cyberattaques financières",
      solution: "Pentest avancé + SOC spécialisé + Formation anti-phishing",
      results: [
        "Détection 100% des tentatives de fraude",
        "Temps de réponse < 15 minutes",
        "0% de perte financière",
        "Certification ISO 27001 obtenue"
      ],
      testimonial: "En finance, la cybersécurité est vitale. Cyna nous protège efficacement contre toutes les menaces.",
      author: "Jean-Michel Petit",
      position: "CEO, FinanceSecure",
      image: "/case-studies/financesecure.jpg",
      tags: ["Finance", "Fraude", "ISO 27001"],
      duration: "5 mois",
      featured: false
    }
  ]

  // Statistiques globales
  const globalStats = [
    {
      value: "98%",
      label: "Satisfaction client",
      description: "Taux de satisfaction moyen de nos clients"
    },
    {
      value: "24h",
      label: "Temps de réponse",
      description: "Délai moyen de première intervention"
    },
    {
      value: "0",
      label: "Incidents majeurs",
      description: "Chez nos clients SOC depuis 12 mois"
    },
    {
      value: "280%",
      label: "ROI moyen",
      description: "Retour sur investissement moyen sur 2 ans"
    }
  ]

  // Secteurs couverts
  const sectors = [
    { name: "Santé", count: 15, icon: "🏥" },
    { name: "Finance", count: 12, icon: "🏦" },
    { name: "Industrie", count: 18, icon: "🏭" },
    { name: "Secteur Public", count: 8, icon: "🏛️" },
    { name: "Services", count: 22, icon: "💼" },
    { name: "Commerce", count: 14, icon: "🛒" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-6">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Succès Clients</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Nos clients témoignent
              <span className="block text-[#A67FFB]">de leur transformation</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Découvrez comment nos solutions cybersécurité ont transformé 
              la sécurité et la sérénité de nos clients à travers des cas concrets.
            </p>
          </div>
        </div>
      </section>

      {/* Statistiques globales */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Des résultats qui parlent
            </h2>
            <p className="text-xl text-gray-600">
              L'efficacité de nos solutions mesurée concrètement
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {globalStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#A67FFB] mb-2">
                  {stat.value}
                </div>
                <div className="text-xl font-semibold text-[#161A22] mb-2">
                  {stat.label}
                </div>
                <p className="text-gray-600 text-sm">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Études de cas en vedette */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Études de cas détaillées
            </h2>
            <p className="text-xl text-gray-600">
              Projets réalisés et transformations réussies
            </p>
          </div>
          
          <div className="space-y-12">
            {caseStudies.filter(cs => cs.featured).map((caseStudy, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Contenu principal */}
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#A67FFB] rounded-xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#161A22]">
                          {caseStudy.company}
                        </h3>
                        <div className="flex items-center gap-3 text-gray-600">
                          <span>{caseStudy.sector}</span>
                          <span>•</span>
                          <span>{caseStudy.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-[#161A22] mb-2">Défi :</h4>
                        <p className="text-gray-700">{caseStudy.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-[#161A22] mb-2">Solution :</h4>
                        <p className="text-gray-700">{caseStudy.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-[#161A22] mb-3">Résultats :</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {caseStudy.results.map((result, resultIndex) => (
                            <div key={resultIndex} className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Clock className="h-4 w-4" />
                        Durée du projet : {caseStudy.duration}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-3 py-1 bg-[#A67FFB]/10 text-[#A67FFB] text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Témoignage */}
                  <div className="bg-gradient-to-br from-[#A67FFB]/5 to-purple-50 p-8 lg:p-12 flex flex-col justify-center">
                    <blockquote className="text-lg text-gray-700 italic mb-6">
                      "{caseStudy.testimonial}"
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#A67FFB] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {caseStudy.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#161A22]">
                          {caseStudy.author}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {caseStudy.position}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autres études de cas */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Autres succès clients
            </h2>
            <p className="text-xl text-gray-600">
              Plus de projets réussis à découvrir
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.filter(cs => !cs.featured).map((caseStudy, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#A67FFB]/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-[#A67FFB]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#161A22]">
                      {caseStudy.company}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {caseStudy.sector} • {caseStudy.size}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">
                  {caseStudy.challenge}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {caseStudy.results.slice(0, 2).map((result, resultIndex) => (
                    <div key={resultIndex} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {caseStudy.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 py-1 bg-[#A67FFB]/10 text-[#A67FFB] text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="flex items-center gap-2 text-[#A67FFB] font-medium text-sm hover:underline">
                    Lire plus
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secteurs d'activité */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Secteurs accompagnés
            </h2>
            <p className="text-xl text-gray-600">
              Notre expertise couvre tous les secteurs d'activité
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sectors.map((sector, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{sector.icon}</div>
                <h3 className="font-bold text-[#161A22] mb-1">
                  {sector.name}
                </h3>
                <div className="text-sm text-gray-600">
                  {sector.count} clients
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#161A22]">
        <div className="container-cyna text-center">
          <Shield className="h-16 w-16 text-[#A67FFB] mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Votre entreprise pourrait être la prochaine success story
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez nos clients satisfaits et transformez votre cybersécurité 
            avec l'expertise Cyna.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Demander une étude gratuite
            </button>
            <button className="btn-secondary">
              Télécharger le livre blanc
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 