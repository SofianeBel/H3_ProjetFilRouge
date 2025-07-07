import { Metadata } from "next"
import { Shield, AlertTriangle, Clock, Users, Zap, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "CERT - Réponse à incident | Cyna",
  description: "Service de réponse à incident cybersécurité 24/7. Investigation, éradication et remédiation par nos experts CERT pour une protection optimale de votre SI.",
}

/**
 * Page du service CERT - Réponse à incident
 * Présente notre équipe de réponse aux incidents de sécurité
 */
export default function CertPage() {
  // Étapes de réponse à incident selon les standards
  const responseSteps = [
    {
      step: "01",
      title: "Détection & Alerte",
      description: "Identification immédiate de l'incident et notification de notre équipe CERT",
      icon: AlertTriangle,
    },
    {
      step: "02", 
      title: "Investigation",
      description: "Analyse forensique pour comprendre l'origine et l'ampleur de l'attaque",
      icon: Shield,
    },
    {
      step: "03",
      title: "Confinement",
      description: "Isolation des systèmes compromis pour limiter la propagation",
      icon: Zap,
    },
    {
      step: "04",
      title: "Éradication",
      description: "Suppression complète des menaces et vulnérabilités exploitées",
      icon: CheckCircle,
    },
  ]

  // Nos capacités de réponse d'incident
  const capabilities = [
    "Analyse forensique avancée",
    "Investigation malware",
    "Récupération de données",
    "Coordination avec les autorités",
    "Communication de crise",
    "Rapport d'incident détaillé",
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#A67FFB]/10 rounded-full mb-6">
                <Shield className="h-4 w-4 text-[#A67FFB]" />
                <span className="text-sm font-medium text-[#A67FFB]">CERT 24/7</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Réponse à incident
                <span className="block text-[#A67FFB]">cybersécurité</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Notre équipe CERT intervient 24/7 pour vous accompagner en cas d'attaque : 
                investigation, éradication et remédiation pour minimiser l'impact sur votre activité.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  Contacter le CERT
                </button>
                <button className="btn-secondary">
                  Hotline d'urgence
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-[#A67FFB]/20 to-[#8B5FE6]/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">CERT Opérationnel 24/7</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Temps de réponse moyen</span>
                    <span className="text-[#A67FFB] font-bold">&lt; 15 min</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Incidents traités/mois</span>
                    <span className="text-[#A67FFB] font-bold">50+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Taux de résolution</span>
                    <span className="text-[#A67FFB] font-bold">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processus de réponse */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Notre processus de réponse à incident
            </h2>
            <p className="text-xl text-gray-600">
              Une méthodologie éprouvée pour gérer efficacement toute cyberattaque
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {responseSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-[#A67FFB]/10 to-[#8B5FE6]/10 rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#A67FFB] rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-[#A67FFB]">{step.step}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#161A22] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Ligne de connexion */}
                  {index < responseSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#A67FFB] to-[#8B5FE6] transform -translate-y-1/2"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Capacités */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-6">
                Nos capacités d'investigation
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Notre équipe CERT dispose des outils et de l'expertise nécessaires 
                pour analyser en profondeur tout type d'incident de sécurité.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#A67FFB] flex-shrink-0" />
                    <span className="text-gray-700">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-[#A67FFB]" />
                <h3 className="text-xl font-bold text-[#161A22]">Disponibilité 24/7</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Notre équipe CERT est disponible en permanence pour réagir rapidement 
                à toute situation d'urgence cybersécurité.
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hotline d'urgence</span>
                  <span className="font-bold text-[#161A22]">+33 X XX XX XX XX</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email CERT</span>
                  <span className="font-bold text-[#161A22]">cert@cyna-it.fr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#A67FFB] to-[#8B5FE6]">
        <div className="container-cyna text-center">
          <Users className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Besoin d'une intervention d'urgence ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Notre équipe CERT est prête à intervenir immédiatement pour vous aider 
            à gérer tout incident de cybersécurité.
          </p>
          <button className="bg-white text-[#A67FFB] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
            Contacter le CERT maintenant
          </button>
        </div>
      </section>
    </div>
  )
} 