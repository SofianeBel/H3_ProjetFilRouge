import Link from 'next/link'
import { Users, ArrowLeft, Clock, CheckCircle, BookOpen } from 'lucide-react'

/**
 * Page placeholder pour le service Formation
 * Design cohérent avec les autres pages de services
 */
export default function FormationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton retour */}
          <div className="mb-8">
            <Link 
              href="/services"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux services
            </Link>
          </div>

          <div className="text-center">
            {/* Icône principale */}
            <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Formation Équipes
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Sensibilisation et formation de vos équipes aux bonnes pratiques de cybersécurité
            </p>

            {/* Badge "En construction" */}
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 px-6 py-3 text-sm font-medium text-orange-700 shadow-sm mb-8">
              <Clock className="mr-2 h-4 w-4" />
              Page en cours de développement
            </div>
          </div>
        </div>
      </section>

      {/* Section informative */}
      <section className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bientôt disponible
            </h2>
            <p className="text-lg text-gray-600">
              Nous travaillons actuellement sur cette page pour vous offrir une expérience optimale.
            </p>
          </div>

          {/* Aperçu des fonctionnalités à venir */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4 p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Modules personnalisés</h3>
                <p className="text-gray-600 text-sm">
                  Formations adaptées à votre secteur d'activité et à vos enjeux spécifiques
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Exercices pratiques</h3>
                <p className="text-gray-600 text-sm">
                  Simulations d'attaques et mise en situation pour un apprentissage concret
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Formation d'équipe</h3>
                <p className="text-gray-600 text-sm">
                  Sessions collectives pour renforcer la culture sécurité de votre organisation
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-orange-50 border border-orange-100">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Certification</h3>
                <p className="text-gray-600 text-sm">
                  Validation des acquis avec certificats reconnus dans le domaine
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Intéressé par nos formations ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contactez-nous dès maintenant pour être informé du lancement de ce service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Nous contacter
            </Link>
            <Link 
              href="/services"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 