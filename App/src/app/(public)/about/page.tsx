import { Metadata } from "next"
import { Shield, Users, Trophy, Target, CheckCircle, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "À propos de Cyna | Pure player cybersécurité",
  description: "Cyna, pure player français en cybersécurité pour PME et MSP. Découvrez notre histoire, nos valeurs et notre mission de protection des entreprises.",
}

/**
 * Page À propos de Cyna
 * Présente l'entreprise, son histoire, ses valeurs et sa mission
 */
export default function AboutPage() {
  // Valeurs de l'entreprise
  const values = [
    {
      title: "Expertise",
      description: "Des experts cyber certifiés avec une maîtrise approfondie du marché des PME",
      icon: Shield,
    },
    {
      title: "Proximité", 
      description: "Notre équipe CERT à vos côtés pour une réponse rapide et efficace",
      icon: Users,
    },
    {
      title: "Réactivité",
      description: "Surveillance 24/7 pour détecter et neutraliser les menaces",
      icon: Target,
    },
  ]

  // Chiffres clés
  const stats = [
    { number: "500+", label: "PME protégées" },
    { number: "50+", label: "Partenaires MSP" },
    { number: "24/7", label: "Surveillance continue" },
    { number: "98%", label: "Satisfaction client" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Pure player en
              <span className="block text-[#A67FFB]">cybersécurité</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Cyna protège les entreprises contre les cyberattaques avec des solutions 
              adaptées aux PME et MSP. Expertise, proximité et réactivité au service de votre sécurité.
            </p>
          </div>
        </div>
      </section>

      {/* Notre mission */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-6">
                Notre mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Chez Cyna, nous croyons que toutes les entreprises, quelle que soit leur taille, 
                méritent une protection cybersécurité de niveau enterprise.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Notre mission est de démocratiser l'accès à la cybersécurité avancée 
                en proposant des solutions adaptées aux contraintes et budgets des PME et MSP.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#A67FFB] flex-shrink-0" />
                  <span className="text-gray-700">Protection accessible à tous</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#A67FFB] flex-shrink-0" />
                  <span className="text-gray-700">Expertise française reconnue</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#A67FFB] flex-shrink-0" />
                  <span className="text-gray-700">Accompagnement personnalisé</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#A67FFB]/20 to-[#8B5FE6]/20 rounded-2xl p-8">
              <div className="text-center">
                <Heart className="h-16 w-16 text-[#A67FFB] mx-auto mb-6" />
                <h3 className="text-xl font-bold text-[#161A22] mb-4">
                  Engagement qualité
                </h3>
                <p className="text-gray-600">
                  La qualité de service est au cœur de notre métier, où nous privilégions 
                  l'expertise, la proximité et la rapidité d'exécution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Nos valeurs
            </h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident notre action au quotidien
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="bg-[#A67FFB] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#161A22] mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-20 bg-[#161A22]">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Cyna en chiffres
            </h2>
            <p className="text-xl text-gray-300">
              Notre impact en protection cybersécurité
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#A67FFB] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Une expertise reconnue
            </h2>
            <p className="text-xl text-gray-600">
              Nos certifications garantissent la qualité de nos services
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
            <div className="text-center">
              <Trophy className="h-16 w-16 text-[#A67FFB] mx-auto mb-6" />
              <h3 className="text-xl font-bold text-[#161A22] mb-4">
                Certifications et partenariats
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chez Cyna, nous nous engageons à respecter les normes les plus élevées 
                en matière de cybersécurité. Nos certifications et partenariats technologiques 
                garantissent la qualité et la fiabilité de nos services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#A67FFB] to-[#8B5FE6]">
        <div className="container-cyna text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rejoignez les 500+ entreprises qui nous font confiance
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvrez comment nos solutions peuvent protéger votre entreprise 
            contre les cybermenaces d'aujourd'hui et de demain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#A67FFB] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Nous contacter
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-[#A67FFB] transition-colors">
              Voir nos références
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 