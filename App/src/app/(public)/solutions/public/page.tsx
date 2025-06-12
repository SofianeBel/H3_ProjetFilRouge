import { Metadata } from "next"
import { Shield, Users, Lock, FileCheck, CheckCircle, Award, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Solutions cybersécurité secteur public | Cyna",
  description: "Protection cybersécurité conforme ANSSI pour le secteur public. Hébergement France, support souverain, audit réglementaire.",
}

/**
 * Page solutions pour le secteur public
 * Solutions conformes aux exigences ANSSI et réglementations publiques
 */
export default function SolutionsPublicPage() {
  // Spécificités secteur public
  const publicRequirements = [
    {
      title: "Conformité ANSSI",
      description: "Respect des référentiels et recommandations de l'ANSSI",
      icon: Award,
      features: ["RGS v2.0", "PSSIE", "Guide ANSSI", "Cyberscore"]
    },
    {
      title: "Hébergement souverain",
      description: "Infrastructure 100% française avec maîtrise totale",
      icon: MapPin,
      features: ["Datacenters France", "Personnel habilité", "Audit sécurité", "Traçabilité complète"]
    },
    {
      title: "Protection données",
      description: "Sécurisation des données sensibles et personnelles",
      icon: Lock,
      features: ["Chiffrement bout en bout", "Accès contrôlé", "Journalisation", "Sauvegarde sécurisée"]
    },
    {
      title: "Audit réglementaire",
      description: "Accompagnement dans les audits et certifications",
      icon: FileCheck,
      features: ["Préparation audits", "Documentation conforme", "Suivi réglementaire", "Mise en conformité"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-6">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Secteur Public</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Cybersécurité conforme
                <span className="block text-[#A67FFB]">aux exigences publiques</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Solutions de cybersécurité respectant les référentiels ANSSI et les contraintes 
                réglementaires du secteur public. Hébergement souverain et expertise française.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  Découvrir nos solutions
                </button>
                <button className="btn-secondary">
                  Conformité ANSSI
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500/20 to-[#A67FFB]/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <Award className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <div className="text-white font-medium">Conforme ANSSI</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Hébergement</span>
                    <span className="text-green-400 font-bold">100% France</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Personnel</span>
                    <span className="text-green-400 font-bold">Habilité Secret</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Référentiels</span>
                    <span className="text-green-400 font-bold">RGS v2.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exigences secteur public */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Répondre aux exigences du secteur public
            </h2>
            <p className="text-xl text-gray-600">
              Solutions adaptées aux contraintes réglementaires et de sécurité
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {publicRequirements.map((requirement, index) => {
              const IconComponent = requirement.icon
              return (
                <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl">
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
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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

      {/* Référentiels et certifications */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Référentiels et certifications
            </h2>
            <p className="text-xl text-gray-600">
              Conformité aux standards du secteur public français
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#161A22] mb-4">RGS v2.0</h3>
              <p className="text-gray-600">
                Référentiel Général de Sécurité pour la sécurité des systèmes d'information
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#161A22] mb-4">PSSIE</h3>
              <p className="text-gray-600">
                Politique de Sécurité des Systèmes d'Information de l'État
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#161A22] mb-4">Cyberscore</h3>
              <p className="text-gray-600">
                Dispositif d'évaluation de la maturité cyber des collectivités
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="container-cyna text-center">
          <Users className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Sécurisez votre administration
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bénéficiez d'une expertise française en cybersécurité conforme 
            aux exigences du secteur public.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Audit de conformité
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-colors">
              Nos références publiques
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 