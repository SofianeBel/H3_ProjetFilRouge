import Link from 'next/link'
import { Lock, ArrowLeft, Clock, CheckCircle, FileText, Award } from 'lucide-react'

/**
 * Page placeholder pour le service Conformité
 * Design cohérent avec les autres pages de services
 */
export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton retour */}
          <div className="mb-8">
            <Link 
              href="/services"
              className="inline-flex items-center text-violet-600 hover:text-violet-800 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux services
            </Link>
          </div>

          <div className="text-center">
            {/* Icône principale */}
            <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg">
              <Lock className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Conformité
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Accompagnement pour la mise en conformité avec les réglementations en vigueur
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
              Nous finalisons cette page pour vous présenter nos services de mise en conformité.
            </p>
          </div>

          {/* Aperçu des fonctionnalités à venir */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4 p-6 rounded-xl bg-violet-50 border border-violet-100">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">GDPR/RGPD</h3>
                <p className="text-gray-600 text-sm">
                  Accompagnement complet pour la conformité au Règlement Général sur la Protection des Données
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
                <p className="text-gray-600 text-sm">
                  Préparation et accompagnement pour la certification ISO 27001 de management de la sécurité
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Audits conformité</h3>
                <p className="text-gray-600 text-sm">
                  Évaluations régulières pour maintenir votre niveau de conformité réglementaire
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl bg-orange-50 border border-orange-100">
              <div className="flex-shrink-0">
                <Lock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Réglementations sectorielles</h3>
                <p className="text-gray-600 text-sm">
                  Conformité spécifique aux secteurs santé, finance, industrie selon vos besoins
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section réglementations */}
      <section className="py-16 bg-gradient-to-r from-violet-100 to-purple-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Principales réglementations couvertes
            </h2>
            <p className="text-lg text-gray-600">
              Nous vous accompagnons sur l'ensemble des standards et réglementations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* RGPD */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">RGPD</h3>
                <p className="text-gray-600 text-sm">Protection des données personnelles</p>
              </div>
            </div>

            {/* ISO 27001 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
                <p className="text-gray-600 text-sm">Management de la sécurité de l'information</p>
              </div>
            </div>

            {/* PCI-DSS */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">PCI-DSS</h3>
                <p className="text-gray-600 text-sm">Sécurité des données de cartes de paiement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Besoin d'aide pour votre conformité ?
          </h2>
          <p className="text-xl text-violet-100 mb-8">
            Contactez-nous pour évaluer vos besoins en conformité réglementaire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-violet-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Nous contacter
            </Link>
            <Link 
              href="/services"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-violet-600 transition-colors"
            >
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 