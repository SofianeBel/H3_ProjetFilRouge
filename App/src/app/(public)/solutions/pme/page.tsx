import { Metadata } from "next"
import { Building2, Shield, Clock, TrendingUp, CheckCircle, Users, Euro, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Solutions cybersécurité PME | Cyna",
  description: "Protection cybersécurité complète pour PME. SOC managé 24/7, audit sécurité, formation équipes. Plus de 500 PME nous font confiance.",
}

/**
 * Page solutions pour les PME
 * Présente nos offres spécialement adaptées aux petites et moyennes entreprises
 */
export default function SolutionsPMEPage() {
  // Services adaptés aux PME
  const pmeServices = [
    {
      title: "SOC Managé 24/7",
      description: "Surveillance continue de votre système d'information par nos experts",
      icon: Shield,
      features: [
        "Détection temps réel",
        "Analyse des menaces",
        "Réponse automatisée",
        "Reporting mensuel"
      ]
    },
    {
      title: "Audit de Sécurité",
      description: "Évaluation complète de votre posture de sécurité",
      icon: CheckCircle,
      features: [
        "Test d'intrusion",
        "Audit organisationnel", 
        "Plan d'action",
        "Accompagnement mise en œuvre"
      ]
    },
    {
      title: "Formation Équipes",
      description: "Sensibilisation et formation de vos collaborateurs",
      icon: Users,
      features: [
        "Sessions de sensibilisation",
        "Tests de phishing",
        "Formation RSSI",
        "Support continu"
      ]
    },
    {
      title: "Réponse à Incident",
      description: "Intervention rapide en cas de cyberattaque",
      icon: Zap,
      features: [
        "Hotline 24/7",
        "Investigation forensique",
        "Containment",
        "Plan de reprise"
      ]
    }
  ]

  // Avantages spécifiques PME
  const pmeAdvantages = [
    {
      title: "Budget maîtrisé",
      description: "Solutions abordables avec un ROI démontré",
      icon: Euro,
      stat: "50% d'économies vs solution interne"
    },
    {
      title: "Mise en œuvre rapide",
      description: "Déploiement en moins de 48h sans impact métier",
      icon: Clock,
      stat: "< 48h de déploiement"
    },
    {
      title: "Expertise accessible",
      description: "Accès à des experts seniors sans les embaucher",
      icon: TrendingUp,
      stat: "15+ années d'expérience moyenne"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
                <Building2 className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Solutions PME</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Cybersécurité pour
                <span className="block text-[#A67FFB]">petites & moyennes entreprises</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Protection complète et abordable adaptée aux besoins et contraintes des PME. 
                Bénéficiez d'un niveau de sécurité enterprise sans la complexité.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  Découvrir nos offres PME
                </button>
                <button className="btn-secondary">
                  Calculer mon ROI
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-[#A67FFB]/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-2">500+</div>
                  <div className="text-blue-400">PME protégées</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Temps moyen détection</span>
                    <span className="text-[#A67FFB] font-bold">3 min</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Incidents bloqués/mois</span>
                    <span className="text-[#A67FFB] font-bold">1200+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Satisfaction client</span>
                    <span className="text-[#A67FFB] font-bold">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services pour PME */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Services adaptés aux PME
            </h2>
            <p className="text-xl text-gray-600">
              Une gamme complète de services pensés pour les contraintes des PME
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {pmeServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-[#A67FFB] rounded-xl">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#161A22]">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Avantages PME */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Pourquoi les PME nous choisissent
            </h2>
            <p className="text-xl text-gray-600">
              Des avantages concrets adaptés aux réalités des PME
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pmeAdvantages.map((advantage, index) => {
              const IconComponent = advantage.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg">
                  <div className="bg-gradient-to-br from-blue-500 to-[#A67FFB] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#161A22] mb-3">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {advantage.description}
                  </p>
                  <div className="text-2xl font-bold text-[#A67FFB]">
                    {advantage.stat}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Témoignages PME */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Ce que disent nos clients PME
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AS</span>
                </div>
                <div>
                  <div className="font-bold text-[#161A22]">Ahmed S.</div>
                  <div className="text-gray-600">Directeur SI, PME 45 salariés</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "On se sent vraiment épaulé par une équipe d'experts au quotidien, 
                ce qui apporte une vraie tranquillité d'esprit. C'est plus qu'un simple accompagnement."
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#A67FFB] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JJ</span>
                </div>
                <div>
                  <div className="font-bold text-[#161A22]">Jérémy J.</div>
                  <div className="text-gray-600">DSI, PME 80 salariés</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Une équipe d'experts réactive et efficace. Grâce au service, nous avons 
                renforcé notre sécurité conformément aux attentes de nos clients."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subventions */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-cyna">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Financez votre cybersécurité jusqu'à 80%
            </h2>
            <p className="text-xl text-gray-600">
              Bénéficiez des dispositifs d'aide de l'État pour sécuriser votre PME
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#161A22] mb-4">
                Diag Cybersécurité
              </h3>
              <p className="text-gray-600 mb-4">
                Audit complet de votre sécurité avec financement jusqu'à 80% par l'État
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Audit organisationnel et technique</li>
                <li>• Tests d'intrusion</li>
                <li>• Plan d'action personnalisé</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Euro className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#161A22] mb-4">
                Chèque Investissement Cyber
              </h3>
              <p className="text-gray-600 mb-4">
                Financement des solutions de protection et équipements de sécurité
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Solutions de protection</li>
                <li>• Mise à niveau matériel</li>
                <li>• Formation des équipes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-[#A67FFB]">
        <div className="container-cyna text-center">
          <Building2 className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à sécuriser votre PME ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Commencez par un audit gratuit et découvrez comment protéger efficacement 
            votre entreprise avec nos solutions adaptées aux PME.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Audit gratuit PME
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Parler à un expert
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 