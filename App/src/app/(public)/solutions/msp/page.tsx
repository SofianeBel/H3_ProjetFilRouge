import { Metadata } from "next"
import { Server, Shield, Package, Users, TrendingUp, CheckCircle, HandHeart, Briefcase } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Solutions cybersécurité MSP | Cyna",
  description: "SOC 24/7 en marque blanche pour MSP. Kit commercial clé en main, formation partenaires, support technique. 50+ MSP nous font confiance.",
}

/**
 * Page solutions pour les MSP (Managed Service Providers)
 * Offres clé en main pour les fournisseurs de services managés
 */
export default function SolutionsMSPPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#A67FFB]/10 rounded-full mb-6">
                <Server className="h-4 w-4 text-[#A67FFB]" />
                <span className="text-sm font-medium text-[#A67FFB]">Solutions MSP</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                SOC 24/7 en marque blanche
                <span className="block text-[#A67FFB]">pour MSP</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Renforcez vos offres cybersécurité avec notre SOC managé clé en main. 
                Proposez une cybersécurité de haute qualité à vos clients PME sans investissement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                             <Link 
               href="/booking?mode=booking&service=MSP"
               className="bg-white text-[#A67FFB] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
             >
               Devenir partenaire MSP
             </Link>
                <Link 
                  href="/booking?mode=message&service=MSP"
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-[#A67FFB] transition-colors"
                >
                  Kit commercial
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-[#A67FFB]/20 to-[#8B5FE6]/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-2">50+</div>
                  <div className="text-[#A67FFB]">Partenaires MSP</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Mise en œuvre</span>
                    <span className="text-[#A67FFB] font-bold">&lt; 7 jours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Support technique</span>
                    <span className="text-[#A67FFB] font-bold">24/7</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Marge partenaire</span>
                    <span className="text-[#A67FFB] font-bold">Attractive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offres MSP */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Une offre complète et accessible
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce dont vous avez besoin pour proposer une cybersécurité de pointe
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#A67FFB]/10 to-[#8B5FE6]/10 rounded-2xl p-8">
              <Package className="h-12 w-12 text-[#A67FFB] mb-6" />
              <h3 className="text-xl font-bold text-[#161A22] mb-4">
                Offre complète
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• SOC managé 24/7</li>
                <li>• Tests d'intrusion</li>
                <li>• Formation équipes</li>
                <li>• Support technique</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-[#A67FFB]/10 rounded-2xl p-8">
              <Briefcase className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-[#161A22] mb-4">
                Kit commercial
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Documentation vente</li>
                <li>• Argumentaires techniques</li>
                <li>• Supports de présentation</li>
                <li>• Formation commerciale</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl p-8">
              <HandHeart className="h-12 w-12 text-green-500 mb-6" />
              <h3 className="text-xl font-bold text-[#161A22] mb-4">
                Accompagnement
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Formation technique</li>
                <li>• Support avant-vente</li>
                <li>• Suivi déploiements</li>
                <li>• Relation client partagée</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignage MSP */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 justify-center mb-6">
                <div className="w-16 h-16 bg-[#A67FFB] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JK</span>
                </div>
                <div>
                  <div className="font-bold text-[#161A22] text-lg">Jérémie K.</div>
                  <div className="text-gray-600">Directeur BU informatique, MSP</div>
                </div>
              </div>
              <p className="text-lg text-gray-700 italic">
                "En intégrant la solution SOC 24/7 de Cyna dans notre offre, nous avons pu proposer 
                une cybersécurité de pointe à nos clients PME. Grâce à l'accompagnement et au kit commercial, 
                nous avons développé cette offre très rapidement."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#A67FFB] to-[#8B5FE6]">
        <div className="container-cyna text-center">
          <Server className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à renforcer vos offres cyber ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvrez comment notre partenariat peut vous aider à développer 
            rapidement vos services de cybersécurité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking?mode=booking&service=MSP"
              className="bg-white text-[#A67FFB] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Devenir partenaire
            </Link>
            <Link 
              href="/booking?mode=message&service=MSP"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-[#A67FFB] transition-colors"
            >
              Kit commercial
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 