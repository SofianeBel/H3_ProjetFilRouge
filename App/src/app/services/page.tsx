import Link from "next/link"
import { Shield, Eye, AlertTriangle, Users, CheckCircle, ArrowRight } from "lucide-react"

/**
 * Page principale des services
 * Présente tous les services de cybersécurité de Cyna
 */
export default function ServicesPage() {
  const services = [
    {
      id: 'soc',
      icon: Eye,
      title: 'SOC 24/7',
      subtitle: 'Security Operations Center',
      description: 'Surveillance continue de votre infrastructure par nos experts certifiés. Détection et réponse aux incidents en temps réel.',
      features: [
        'Monitoring 24h/24, 7j/7',
        'Analyse comportementale avancée',
        'Réponse aux incidents sous 15 minutes',
        'Rapports mensuels détaillés'
      ],
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'audit',
      icon: Shield,
      title: 'Audit de Sécurité',
      subtitle: 'Évaluation complète',
      description: 'Analyse approfondie de votre posture de sécurité avec identification des vulnérabilités et plan d\'amélioration.',
      features: [
        'Audit technique complet',
        'Analyse des configurations',
        'Tests de conformité RGPD',
        'Plan de remédiation prioritisé'
      ],
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 'pentest',
      icon: AlertTriangle,
      title: 'Tests d\'Intrusion',
      subtitle: 'Pentest & Red Team',
      description: 'Simulations d\'attaques réelles pour tester la robustesse de vos défenses et identifier les failles critiques.',
      features: [
        'Pentest applicatif & réseau',
        'Tests d\'ingénierie sociale',
        'Simulation d\'attaques avancées',
        'Rapport exécutif & technique'
      ],
      color: 'from-red-500 to-orange-600'
    },
    {
      id: 'cert',
      icon: Users,
      title: 'CERT',
      subtitle: 'Computer Emergency Response Team',
      description: 'Équipe spécialisée dans la réponse aux incidents de sécurité et la gestion de crise cyber.',
      features: [
        'Réponse d\'urgence 24h/7j',
        'Investigation forensique',
        'Containment et éradication',
        'Accompagnement post-incident'
      ],
      color: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-[#111318]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#6B8DE5] via-[#8E63E5] to-[#A67FFB] py-24">
        <div className="container-cyna text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Nos Services de 
            <span className="block text-[#FFE5A3]">Cybersécurité</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Une approche complète pour protéger votre entreprise contre les cybermenaces.
            Des solutions sur-mesure adaptées aux PME et MSP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="btn-primary"
            >
              Audit gratuit
            </Link>
            <Link 
              href="#services-details"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#8E63E5] transition-colors"
            >
              Découvrir nos services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services détaillés */}
      <section id="services-details" className="py-24 bg-[#111318]">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Excellence technique, expertise française
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Chaque service est conçu pour répondre aux défis spécifiques de la cybersécurité moderne
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <div 
                  key={service.id}
                  className="group bg-[#1A1F28] rounded-2xl p-8 border border-gray-700 hover:border-[#6B8DE5] transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Header du service */}
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mr-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      <p className="text-gray-400">{service.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Caractéristiques */}
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#6B8DE5] mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Lien vers le détail */}
                  <Link 
                    href={`/services/${service.id}`}
                    className="inline-flex items-center text-[#6B8DE5] hover:text-[#A67FFB] font-semibold group-hover:translate-x-2 transition-all duration-300"
                  >
                    En savoir plus
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section Processus */}
      <section className="py-24 bg-[#161A22]">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Notre Méthodologie
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Une approche structurée et éprouvée pour garantir votre sécurité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Analyse',
                description: 'Audit initial de votre infrastructure et identification des risques'
              },
              {
                step: '02', 
                title: 'Planification',
                description: 'Conception d\'une stratégie de sécurité adaptée à vos besoins'
              },
              {
                step: '03',
                title: 'Implémentation',
                description: 'Déploiement des solutions avec accompagnement de nos experts'
              },
              {
                step: '04',
                title: 'Monitoring',
                description: 'Surveillance continue et optimisation des dispositifs de sécurité'
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB] rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{process.title}</h3>
                <p className="text-gray-400">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB]">
        <div className="container-cyna text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à Renforcer Votre Sécurité ?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour un audit gratuit et découvrez comment nous pouvons protéger votre entreprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-[#8E63E5] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Demander un audit gratuit
            </Link>
            <Link 
              href="tel:+33123456789"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#8E63E5] transition-colors"
            >
              Appeler maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 