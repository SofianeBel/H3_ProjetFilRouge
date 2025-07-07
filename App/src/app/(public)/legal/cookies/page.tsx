import { Metadata } from "next"
import { Cookie, Settings, Shield, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Politique des cookies | Cyna",
  description: "Politique d'utilisation des cookies sur le site Cyna. Gestion des préférences, types de cookies, finalités et contrôles utilisateur.",
}

/**
 * Page politique des cookies
 * Information sur l'utilisation des cookies et gestion des préférences
 */
export default function CookiesPage() {
  // Types de cookies utilisés
  const cookieTypes = [
    {
      type: "Cookies essentiels",
      icon: Shield,
      description: "Nécessaires au fonctionnement du site et à la sécurité. Ces cookies ne peuvent pas être désactivés.",
      examples: [
        "Cookies de session",
        "Préférences de sécurité",
        "Authentification"
      ],
      mandatory: true
    },
    {
      type: "Cookies de performance",
      icon: Settings,
      description: "Permettent d'analyser l'utilisation du site pour améliorer les performances et l'expérience utilisateur.",
      examples: [
        "Google Analytics",
        "Mesure d'audience",
        "Temps de chargement"
      ],
      mandatory: false
    },
    {
      type: "Cookies fonctionnels",
      icon: Info,
      description: "Améliorent les fonctionnalités du site et personnalisent votre expérience de navigation.",
      examples: [
        "Préférences de langue",
        "Paramètres d'affichage",
        "Contenu personnalisé"
      ],
      mandatory: false
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full mb-6">
              <Cookie className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Cookies</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Politique des
              <span className="block text-[#A67FFB]">cookies</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Informations sur l'utilisation des cookies sur notre site web, 
              vos droits et les moyens de contrôler vos préférences.
            </p>
            
            <div className="text-gray-400 text-sm">
              Dernière mise à jour : 15 décembre 2024
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="max-w-4xl mx-auto">
            
            {/* Qu'est-ce qu'un cookie */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Qu'est-ce qu'un cookie ?
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) 
                  lors de la visite d'un site web. Il permet au site de reconnaître votre navigateur et de mémoriser 
                  certaines informations sur votre visite.
                </p>
                
                <p className="mb-4">
                  Les cookies facilitent votre navigation et permettent aux sites web de vous proposer 
                  des contenus adaptés à vos besoins et centres d'intérêt.
                </p>
              </div>
            </section>

            {/* Types de cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Types de cookies utilisés
              </h2>
              
              <div className="space-y-8">
                {cookieTypes.map((cookieType, index) => {
                  const IconComponent = cookieType.icon
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          cookieType.mandatory 
                            ? 'bg-green-500' 
                            : 'bg-[#A67FFB]'
                        }`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-[#161A22]">
                              {cookieType.type}
                            </h3>
                            {cookieType.mandatory && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                Obligatoire
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-4">
                            {cookieType.description}
                          </p>
                          
                          <div>
                            <h4 className="font-semibold text-[#161A22] mb-2">Exemples :</h4>
                            <ul className="list-disc pl-6 space-y-1">
                              {cookieType.examples.map((example, exampleIndex) => (
                                <li key={exampleIndex} className="text-gray-700 text-sm">
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Finalités */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Finalités de l'utilisation des cookies
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">Nous utilisons les cookies pour les finalités suivantes :</p>
                
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Fonctionnement du site :</strong> Assurer le bon fonctionnement et la sécurité du site</li>
                  <li><strong>Amélioration de l'expérience :</strong> Personnaliser le contenu et mémoriser vos préférences</li>
                  <li><strong>Mesure d'audience :</strong> Analyser la fréquentation et l'utilisation du site</li>
                  <li><strong>Performance :</strong> Optimiser les temps de chargement et les fonctionnalités</li>
                </ul>
              </div>
            </section>

            {/* Durée de conservation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Durée de conservation
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-3">Durées de conservation par type :</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</li>
                    <li><strong>Cookies fonctionnels :</strong> Conservés jusqu'à 12 mois</li>
                    <li><strong>Cookies analytiques :</strong> Conservés jusqu'à 25 mois (Google Analytics)</li>
                    <li><strong>Cookies de préférences :</strong> Conservés jusqu'à 12 mois</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contrôle des cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Comment contrôler les cookies ?
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-[#161A22] mb-3">
                  1. Paramètres du site
                </h3>
                <p className="mb-4">
                  Vous pouvez modifier vos préférences de cookies à tout moment en cliquant sur le lien 
                  "Paramètres des cookies" présent en bas de chaque page de notre site.
                </p>
                
                <h3 className="text-lg font-semibold text-[#161A22] mb-3">
                  2. Paramètres du navigateur
                </h3>
                <p className="mb-4">
                  Vous pouvez configurer votre navigateur pour :
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Bloquer tous les cookies</li>
                  <li>Accepter seulement les cookies du site visité</li>
                  <li>Être averti avant l'installation d'un cookie</li>
                  <li>Supprimer les cookies déjà installés</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-[#161A22] mb-3">
                  3. Outils de désactivation spécifiques
                </h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li><strong>Google Analytics :</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:text-blue-700">Plugin de désactivation</a></li>
                  <li><strong>Publicité ciblée :</strong> <a href="http://www.youronlinechoices.com/fr/" className="text-blue-600 hover:text-blue-700">Your Online Choices</a></li>
                </ul>
              </div>
            </section>

            {/* Cookies tiers */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Cookies de services tiers
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Certains cookies sont déposés par des services tiers que nous utilisons :
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-[#161A22] mb-3">Services utilisés :</h4>
                  <ul className="space-y-3">
                    <li>
                      <strong>Google Analytics :</strong> Mesure d'audience et statistiques de visite
                      <br />
                      <small className="text-gray-600">
                        Politique de confidentialité : 
                        <a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-700 ml-1">
                          Google Privacy Policy
                        </a>
                      </small>
                    </li>
                    <li>
                      <strong>Calendly :</strong> Système de prise de rendez-vous
                      <br />
                      <small className="text-gray-600">
                        Politique de confidentialité : 
                        <a href="https://calendly.com/privacy" className="text-blue-600 hover:text-blue-700 ml-1">
                          Calendly Privacy Policy
                        </a>
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Conséquences de la désactivation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Conséquences de la désactivation des cookies
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="font-semibold text-amber-800 mb-3">⚠️ Attention</h3>
                  <p className="text-amber-700 mb-3">
                    La désactivation de certains cookies peut affecter le fonctionnement du site :
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-amber-700">
                    <li>Perte des préférences et paramètres personnalisés</li>
                    <li>Nécessité de se reconnecter à chaque visite</li>
                    <li>Fonctionnalités avancées indisponibles</li>
                    <li>Expérience utilisateur dégradée</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Mise à jour */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Mise à jour de cette politique
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Cette politique des cookies peut être mise à jour occasionnellement. 
                  Nous vous recommandons de la consulter régulièrement pour vous tenir informé 
                  des éventuelles modifications.
                </p>
                
                <p className="mb-4">
                  En cas de modification substantielle, nous vous en informerons par une notification 
                  sur le site ou par email.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-8">
              <h2 className="text-xl font-bold text-[#161A22] mb-4 flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Questions sur les cookies ?
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant notre utilisation des cookies, contactez-nous :
              </p>
              <div className="text-gray-700">
                <p>Email : <a href="mailto:dpo@cyna.fr" className="text-blue-600 hover:text-blue-700">dpo@cyna.fr</a></p>
                <p>Téléphone : +33 (0)1 23 45 67 89</p>
              </div>
            </section>

            {/* Bouton de gestion des cookies */}
            <div className="mt-12 text-center">
              <button className="bg-[#A67FFB] text-white font-semibold px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors">
                Gérer mes préférences de cookies
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 