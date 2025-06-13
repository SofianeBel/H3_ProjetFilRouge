import Link from "next/link"
import { Eye, Shield, Clock, AlertTriangle, CheckCircle, Phone, Mail } from "lucide-react"
import { AddToCartButton } from "@/components/ui/add-to-cart-button"

/**
 * Page détaillée du service SOC (Security Operations Center)
 * Présente en détail le service de surveillance 24/7
 */
export default function SOCPage() {
  return (
    <div className="min-h-screen bg-[#111318]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-24">
        <div className="container-cyna">
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mr-6">
              <Eye className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
                SOC 24/7
              </h1>
              <p className="text-xl text-blue-100">Security Operations Center</p>
            </div>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mb-8">
            Surveillance continue et protection proactive de votre infrastructure par nos experts certifiés. 
            Détection, analyse et réponse aux incidents de sécurité en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/booking?mode=booking&service=SOC"
              className="btn-primary bg-white text-blue-600 hover:bg-gray-100"
            >
              Demander un devis
            </Link>
            <Link 
              href="#details"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages clés */}
      <section id="details" className="py-20 bg-[#111318]">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pourquoi Choisir Notre SOC ?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Une surveillance experte pour une protection maximale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Clock,
                title: "Surveillance 24/7",
                description: "Monitoring continu par des analystes SOC certifiés, 365 jours par an"
              },
              {
                icon: AlertTriangle,
                title: "Réponse Rapide",
                description: "Temps de réponse garanti sous 15 minutes pour les incidents critiques"
              },
              {
                icon: Shield,
                title: "Protection Avancée",
                description: "Technologies de pointe avec IA et machine learning pour la détection d'anomalies"
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services inclus */}
      <section className="py-20 bg-[#161A22]">
        <div className="container-cyna">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Services Inclus dans Notre SOC
              </h2>
              <p className="text-gray-400 mb-8">
                Un ensemble complet de services pour assurer la sécurité de votre infrastructure IT.
              </p>
              
              <div className="space-y-4">
                {[
                  "Monitoring réseau et systèmes en temps réel",
                  "Analyse comportementale et détection d'anomalies",
                  "Gestion et corrélation des logs de sécurité",
                  "Réponse aux incidents et investigation forensique",
                  "Veille cyber et mise à jour des signatures",
                  "Rapports mensuels détaillés et tableaux de bord",
                  "Support et conseil par des experts certifiés",
                  "Intégration avec vos outils existants"
                ].map((service, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1F28] rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Temps de Réponse Garantis</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">Incidents Critiques</span>
                  <span className="text-red-400 font-semibold">≤ 15 minutes</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">Incidents Majeurs</span>
                  <span className="text-yellow-400 font-semibold">≤ 1 heure</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">Incidents Mineurs</span>
                  <span className="text-green-400 font-semibold">≤ 4 heures</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-300">Disponibilité</span>
                  <span className="text-blue-400 font-semibold">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies utilisées */}
      <section className="py-20 bg-[#111318]">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Technologies et Certifications
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Nous utilisons les meilleures technologies du marché et notre équipe possède les certifications les plus exigeantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Technologies</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "SIEM/SOAR", "EDR/XDR", "UEBA", "Threat Intel",
                  "Sandbox", "IDS/IPS", "Vulnerability Scanners", "MISP"
                ].map((tech, index) => (
                  <div key={index} className="bg-[#1A1F28] rounded-lg p-4 text-center border border-gray-700">
                    <span className="text-gray-300 font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Certifications de l&apos;équipe</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "CISSP", "GSEC", "GCIH", "GNFA",
                  "CEH", "OSCP", "CCNA Security", "ISO 27001"
                ].map((cert, index) => (
                  <div key={index} className="bg-[#1A1F28] rounded-lg p-4 text-center border border-gray-700">
                    <span className="text-gray-300 font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarification */}
      <section className="py-20 bg-[#161A22]">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tarification Flexible
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Des formules adaptées à la taille de votre entreprise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "PME",
                price: "2 500",
                period: "/mois",
                description: "Parfait pour les petites entreprises",
                features: [
                  "Jusqu'à 50 assets",
                  "Surveillance 24/7",
                  "Rapports mensuels",
                  "Support par email"
                ]
              },
              {
                name: "Entreprise",
                price: "5 000",
                period: "/mois",
                description: "Idéal pour les moyennes entreprises",
                features: [
                  "Jusqu'à 200 assets",
                  "Surveillance 24/7",
                  "Rapports hebdomadaires",
                  "Support téléphonique",
                  "Formation équipe"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Sur devis",
                period: "",
                description: "Solution sur-mesure",
                features: [
                  "Assets illimités",
                  "Surveillance 24/7",
                  "Rapports quotidiens",
                  "Support dédié",
                  "Formation avancée",
                  "SOC analyst dédié"
                ]
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-[#1A1F28] rounded-2xl p-8 border ${plan.popular ? 'border-blue-500' : 'border-gray-700'} relative`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Plus populaire
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}€</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.name === "Enterprise" ? (
                  <Link 
                    href={`/booking?mode=booking&service=SOC&plan=${plan.name}`}
                    className="btn-primary w-full bg-gray-700 hover:bg-gray-600"
                  >
                    Demander un devis
                  </Link>
                ) : (
                  <AddToCartButton
                    serviceSlug="soc"
                    planName={plan.name}
                    className={plan.popular ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}
                  >
                    Choisir ce plan
                  </AddToCartButton>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container-cyna text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à Sécuriser Votre Infrastructure ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contactez notre équipe pour une évaluation gratuite et découvrez comment notre SOC peut protéger votre entreprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking?mode=booking&service=SOC"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              Demander un devis
            </Link>
            <Link 
              href="tel:+33123456789"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              <Phone className="mr-2 h-5 w-5" />
              Appeler maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 