import { Metadata } from "next"
import { Shield, Eye, Lock, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Politique de confidentialité | Cyna",
  description: "Politique de confidentialité et protection des données personnelles de Cyna. Conformité RGPD et engagement transparence.",
}

/**
 * Page Politique de confidentialité
 * Conforme RGPD et transparente sur l'utilisation des données
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-12">
        <div className="container-cyna">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#A67FFB]/10 rounded-full mb-6">
              <Shield className="h-4 w-4 text-[#A67FFB]" />
              <span className="text-sm font-medium text-[#A67FFB]">RGPD Compliant</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Politique de confidentialité
            </h1>
            
            <p className="text-xl text-gray-300">
              Chez Cyna, la protection de vos données personnelles est notre priorité. 
              Découvrez comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16">
        <div className="container-cyna">
          <div className="max-w-4xl mx-auto">
            {/* Informations générales */}
            <div className="mb-12">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Engagement RGPD</h3>
                    <p className="text-blue-800">
                      Cette politique de confidentialité est conforme au Règlement Général sur la Protection des Données (RGPD) 
                      et à la loi Informatique et Libertés. Dernière mise à jour : 8 janvier 2025.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Responsable du traitement */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 flex items-center gap-3">
                <Users className="h-6 w-6 text-[#A67FFB]" />
                1. Responsable du traitement
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  Le responsable du traitement des données personnelles est :
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="font-semibold text-[#161A22] mb-2">CYNA-IT SAS</p>
                  <p className="text-gray-700 mb-1">Siège social : 10 rue de Penthièvre, 75008 Paris</p>
                  <p className="text-gray-700 mb-1">Bureaux : 11 avenue Dubonnet, 92400 Courbevoie</p>
                  <p className="text-gray-700 mb-1">Email : contact@cyna-it.fr</p>
                  <p className="text-gray-700">Téléphone : +33 1 89 70 14 36</p>
                </div>
              </div>
            </div>

            {/* 2. Données collectées */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 flex items-center gap-3">
                <Eye className="h-6 w-6 text-[#A67FFB]" />
                2. Données personnelles collectées
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#161A22] mb-3">Données d'identification</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Nom et prénom</li>
                    <li>• Adresse email professionnelle</li>
                    <li>• Numéro de téléphone</li>
                    <li>• Fonction et entreprise</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[#161A22] mb-3">Données de navigation</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Adresse IP</li>
                    <li>• Cookies techniques et analytiques</li>
                    <li>• Pages visitées et durée de visite</li>
                    <li>• Données de performance du site</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Finalités et bases légales */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6">
                3. Finalités et bases légales du traitement
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Finalité</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Base légale</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Durée de conservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">Gestion des demandes de contact</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Intérêt légitime</td>
                      <td className="px-6 py-4 text-sm text-gray-700">3 ans</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">Newsletter et communications</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Consentement</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Jusqu'au désabonnement</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">Amélioration du site web</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Intérêt légitime</td>
                      <td className="px-6 py-4 text-sm text-gray-700">13 mois</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">Gestion des services SOC</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Exécution du contrat</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Durée contractuelle + 5 ans</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Vos droits */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 flex items-center gap-3">
                <Lock className="h-6 w-6 text-[#A67FFB]" />
                4. Vos droits
              </h2>
              
              <div className="bg-gradient-to-br from-[#A67FFB]/10 to-[#8B5FE6]/10 rounded-lg p-6 mb-6">
                <p className="text-gray-700 mb-4">
                  Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-[#161A22]">• Droit d'accès</p>
                    <p className="font-semibold text-[#161A22]">• Droit de rectification</p>
                    <p className="font-semibold text-[#161A22]">• Droit à l'effacement</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-[#161A22]">• Droit à la portabilité</p>
                    <p className="font-semibold text-[#161A22]">• Droit d'opposition</p>
                    <p className="font-semibold text-[#161A22]">• Droit à la limitation</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700">
                Pour exercer vos droits, contactez-nous à l'adresse : 
                <a href="mailto:dpo@cyna-it.fr" className="text-[#A67FFB] font-semibold ml-1">dpo@cyna-it.fr</a>
              </p>
            </div>

            {/* 5. Sécurité des données */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6">
                5. Sécurité et protection des données
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  En tant qu'expert en cybersécurité, Cyna met en œuvre des mesures techniques et organisationnelles 
                  appropriées pour assurer la sécurité de vos données personnelles :
                </p>
                
                <ul className="space-y-2 ml-6">
                  <li>• Chiffrement des données en transit et au repos</li>
                  <li>• Accès restreint et contrôlé aux données</li>
                  <li>• Surveillance continue des systèmes</li>
                  <li>• Sauvegardes régulières et sécurisées</li>
                  <li>• Formation régulière de nos équipes</li>
                  <li>• Audits de sécurité réguliers</li>
                </ul>
              </div>
            </div>

            {/* 6. Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6">
                6. Politique des cookies
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser notre trafic :
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-[#161A22] mb-2">Cookies essentiels</h4>
                    <p className="text-sm">Nécessaires au fonctionnement du site</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-[#161A22] mb-2">Cookies analytiques</h4>
                    <p className="text-sm">Analyse des performances et du trafic</p>
                  </div>
                </div>
                
                <p>
                  Vous pouvez gérer vos préférences de cookies via notre bandeau de consentement 
                  ou les paramètres de votre navigateur.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-[#A67FFB] to-[#8B5FE6] rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Questions sur cette politique ?</h3>
              <p className="mb-4">
                Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits, 
                contactez notre Délégué à la Protection des Données.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:dpo@cyna-it.fr"
                  className="bg-white text-[#A67FFB] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
                >
                  Contacter le DPO
                </a>
                <a 
                  href="/legal/cookies"
                  className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-[#A67FFB] transition-colors text-center"
                >
                  Politique des cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 