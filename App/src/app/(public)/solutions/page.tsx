import { Metadata } from "next"
import Link from "next/link"
import { Building2, Server, Shield, Heart, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Solutions cybersécurité par secteur | Cyna",
  description: "Solutions de cybersécurité adaptées à chaque secteur : PME, MSP, secteur public et santé. Protection 24/7 par des experts français.",
}

/**
 * Page principale des solutions par secteur
 * Présente nos différentes offres adaptées aux besoins spécifiques
 */
export default function SolutionsPage() {
  // Solutions par secteur avec leurs spécificités
  const solutions = [
    {
      title: "Solutions PME",
      description: "Protection complète adaptée aux petites et moyennes entreprises",
      icon: Building2,
      href: "/solutions/pme",
      features: [
        "SOC managé 24/7",
        "Audit de sécurité",
        "Réponse à incident",
        "Formation des équipes"
      ],
      color: "from-blue-500 to-blue-600",
      stats: "+500 PME protégées",
    },
    {
      title: "Solutions MSP",
      description: "Offres clé en main pour les fournisseurs de services managés",
      icon: Server,
      href: "/solutions/msp",
      features: [
        "SOC en marque blanche",
        "Kit commercial",
        "Support technique",
        "Formation partenaires"
      ],
      color: "from-[#A67FFB] to-[#8B5FE6]",
      stats: "50+ partenaires MSP",
    },
    {
      title: "Secteur Public",
      description: "Solutions conformes aux exigences du secteur public",
      icon: Shield,
      href: "/solutions/public",
      features: [
        "Conformité ANSSI",
        "Hébergement France",
        "Support souverain",
        "Audit réglementaire"
      ],
      color: "from-green-500 to-green-600",
      stats: "Conforme ANSSI",
    },
    {
      title: "Secteur Santé",
      description: "Protection spécialisée pour les établissements de santé",
      icon: Heart,
      href: "/solutions/sante",
      features: [
        "Conformité HDS",
        "Protection données santé",
        "Continuité de service",
        "Support 24/7"
      ],
      color: "from-red-500 to-red-600",
      stats: "Certifié HDS",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Solutions cybersécurité
              <span className="block text-[#A67FFB]">par secteur d'activité</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Chez Cyna, nous adaptons nos solutions de cybersécurité aux spécificités 
              de votre secteur pour une protection optimale et conforme aux réglementations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-[#A67FFB] rounded-full"></div>
                <span>Solutions sur mesure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-[#A67FFB] rounded-full"></div>
                <span>Conformité réglementaire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-[#A67FFB] rounded-full"></div>
                <span>Support expert français</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => {
              const IconComponent = solution.icon
              return (
                <div key={index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${solution.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {solution.stats}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-[#161A22] mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {solution.description}
                    </p>
                    
                    {/* Features */}
                    <ul className="space-y-2 mb-8">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-gray-700">
                          <div className="h-1.5 w-1.5 bg-[#A67FFB] rounded-full flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {/* CTA */}
                    <Link 
                      href={solution.href}
                      className="inline-flex items-center gap-2 text-[#A67FFB] font-semibold group-hover:gap-3 transition-all duration-300"
                    >
                      Découvrir cette solution
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pourquoi choisir nos solutions sectorielles */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Pourquoi adapter la cybersécurité par secteur ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque secteur d'activité a ses propres défis, réglementations et contraintes. 
              Nos solutions sont conçues pour répondre précisément à ces spécificités.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#A67FFB] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#161A22] mb-3">
                Conformité réglementaire
              </h3>
              <p className="text-gray-600">
                Respect automatique des normes et réglementations spécifiques à votre secteur d'activité.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#A67FFB] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#161A22] mb-3">
                Besoins métier
              </h3>
              <p className="text-gray-600">
                Prise en compte des contraintes opérationnelles et des processus métier critiques.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#A67FFB] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Server className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#161A22] mb-3">
                Technologies adaptées
              </h3>
              <p className="text-gray-600">
                Solutions techniques optimisées pour les infrastructures typiques de votre secteur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#A67FFB] to-[#8B5FE6]">
        <div className="container-cyna text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Besoin d'une solution personnalisée ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Nos experts analysent vos besoins spécifiques pour vous proposer 
            la solution de cybersécurité la plus adaptée à votre secteur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking?mode=booking"
              className="bg-white text-[#A67FFB] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Demander une consultation
            </Link>
            <Link 
              href="/booking?mode=message"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-[#A67FFB] transition-colors"
            >
              Voir nos références
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 