import Link from 'next/link'
import { Clock, ArrowLeft, AlertTriangle, CheckCircle, Shield, Zap } from 'lucide-react'

/**
 * Page placeholder pour le service Réponse Incident
 * Design cohérent avec les autres pages de services
 */
export default function IncidentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton retour */}
          <div className="mb-8">
            <Link 
              href="/services"
              className="inline-flex items-center text-rose-600 hover:text-rose-800 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux services
            </Link>
          </div>

          <div className="text-center">
            {/* Icône principale */}
            <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 shadow-lg">
              <Clock className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Réponse Incident
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Intervention rapide en cas d'incident de sécurité avec équipe d'experts disponible
            </p>

            {/* Badge "En construction" */}
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 px-6 py-3 text-sm font-medium text-orange-700 shadow-sm mb-8">
              <AlertTriangle className="mr-2 h-4 w-4" />
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
              Nous préparons cette page pour vous présenter notre service de réponse aux incidents.
            </p>
          </div>

          {/* Aperçu des fonctionnalités à venir */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4 p-6 rounded-xl bg-rose-50 border border-rose-100">
              <div className="flex-shrink-0">
                <Zap className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Intervention 2h</h3>
                <p className="text-gray-600 text-sm">
                  Réponse garantie sous 2 heures en cas d'incident critique de sécurité
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Équipe experte</h3>
                <p className="text-gray-600 text-sm">
                  Spécialistes certifiés en forensique et gestion de crise cyber
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Restauration rapide</h3>
                <p className="text-gray-600 text-sm">
                  Remise en service optimisée de vos systèmes critiques
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-orange-50 border border-orange-100">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Disponibilité 24/7</h3>
                <p className="text-gray-600 text-sm">
                  Service d'urgence accessible en permanence, week-ends inclus
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section urgence */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-300 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Incident en cours ?
            </h2>
            <p className="text-red-100 mb-6">
              En attendant le lancement de ce service, contactez-nous immédiatement pour toute urgence sécurité
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-lg"
            >
              <Clock className="mr-2 h-5 w-5" />
              Contact d'urgence
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Préparez-vous aux incidents
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            Contactez-nous pour mettre en place un plan de réponse aux incidents adapté
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-rose-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Nous contacter
            </Link>
            <Link 
              href="/services"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-rose-600 transition-colors"
            >
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 