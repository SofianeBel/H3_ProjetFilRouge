import { Metadata } from "next"
import { Heart, Shield, Lock, Activity, CheckCircle, Award, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Solutions cybersécurité secteur santé | Cyna",
  description: "Protection cybersécurité certifiée HDS pour établissements de santé. Conformité RGPD santé, continuité de service, protection données patients.",
}

/**
 * Page solutions pour le secteur de la santé
 * Solutions conformes HDS et protection des données de santé
 */
export default function SolutionsSantePage() {
  // Spécificités secteur santé
  const healthRequirements = [
    {
      title: "Certification HDS",
      description: "Hébergement de Données de Santé certifié pour la protection des données patients",
      icon: Award,
      features: ["Certification HDS", "Audit ANSSI", "Conformité CNIL", "Traçabilité complète"]
    },
    {
      title: "Continuité de service",
      description: "Garantie de disponibilité pour les systèmes critiques de santé",
      icon: Activity,
      features: ["SLA 99.9%", "Redondance", "Sauvegarde temps réel", "Plan de reprise"]
    },
    {
      title: "Protection données patients",
      description: "Sécurisation renforcée des données personnelles de santé",
      icon: Lock,
      features: ["Chiffrement AES-256", "Anonymisation", "Pseudonymisation", "Contrôle d'accès"]
    },
    {
      title: "Conformité réglementaire",
      description: "Respect des normes spécifiques au secteur de la santé",
      icon: Shield,
      features: ["RGPD santé", "Code de santé publique", "Référentiel HAS", "ISO 27001"]
    }
  ]

  // Types d'établissements
  const healthOrganizations = [
    {
      name: "Hôpitaux publics",
      description: "CHU, CHR, centres hospitaliers",
      icon: "🏥"
    },
    {
      name: "Cliniques privées", 
      description: "Établissements privés de santé",
      icon: "🏥"
    },
    {
      name: "Laboratoires",
      description: "Laboratoires d'analyses médicales",
      icon: "🔬"
    },
    {
      name: "Imagerie médicale",
      description: "Centres de radiologie, IRM, scanner",
      icon: "🩻"
    },
    {
      name: "Maisons de santé",
      description: "MSP, centres de soins",
      icon: "🏠"
    },
    {
      name: "EHPAD",
      description: "Établissements pour personnes âgées",
      icon: "👴"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full mb-6">
                <Heart className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">Secteur Santé</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Cybersécurité certifiée
                <span className="block text-[#A67FFB]">pour la santé</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Protection spécialisée pour les établissements de santé avec certification HDS, 
                conformité RGPD santé et continuité de service garantie 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  Solutions santé
                </button>
                <button className="btn-secondary">
                  Certification HDS
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-red-500/20 to-[#A67FFB]/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <Heart className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <div className="text-white font-medium">Certifié HDS</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Disponibilité</span>
                    <span className="text-red-400 font-bold">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Conformité</span>
                    <span className="text-red-400 font-bold">RGPD Santé</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Support</span>
                    <span className="text-red-400 font-bold">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exigences secteur santé */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Protection adaptée aux enjeux de santé
            </h2>
            <p className="text-xl text-gray-600">
              Solutions conformes aux exigences spécifiques du secteur de la santé
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {healthRequirements.map((requirement, index) => {
              const IconComponent = requirement.icon
              return (
                <div key={index} className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#161A22]">
                      {requirement.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    {requirement.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {requirement.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Types d'établissements */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Tous les établissements de santé
            </h2>
            <p className="text-xl text-gray-600">
              Solutions adaptées à chaque type d'établissement
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {healthOrganizations.map((org, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-4">{org.icon}</div>
                  <h3 className="text-lg font-bold text-[#161A22] mb-2">
                    {org.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {org.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification HDS */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container-cyna">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Certification HDS : votre garantie de sécurité
            </h2>
            <p className="text-xl text-gray-600">
              Hébergement de Données de Santé certifié par l'ANSSI
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-[#161A22] mb-6">
                  Qu'est-ce que la certification HDS ?
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    La certification HDS (Hébergement de Données de Santé) est obligatoire 
                    pour héberger des données de santé à caractère personnel en France.
                  </p>
                  <p>
                    Elle garantit le respect des exigences de sécurité, de confidentialité 
                    et d'intégrité des données patients selon le référentiel de l'ANSSI.
                  </p>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">Audit ANSSI annuel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">Conformité CNIL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">Traçabilité des accès</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-8 text-white">
                <Award className="h-16 w-16 mb-6" />
                <h4 className="text-xl font-bold mb-4">Certification obtenue</h4>
                <p className="mb-4">
                  Cyna dispose de la certification HDS pour l'hébergement sécurisé 
                  de vos données de santé.
                </p>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="font-semibold">Numéro de certification</div>
                  <div className="text-sm opacity-90">HDS-XXXXX-XX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-pink-600">
        <div className="container-cyna text-center">
          <Heart className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Protégez la santé de vos données
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Confiez la sécurité de vos données de santé à un expert certifié HDS 
            avec une expertise reconnue en cybersécurité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Audit HDS gratuit
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition-colors">
              Nos références santé
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 