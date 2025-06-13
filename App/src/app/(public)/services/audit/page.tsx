import Link from 'next/link'
import { Shield, Search, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { AddToCartButton } from "@/components/ui/add-to-cart-button"

/**
 * Page des services d'audit de sécurité
 * Présentation détaillée des audits de sécurité IT proposés par Cyna
 */
export default function AuditPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Audit de Sécurité IT
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Évaluez et renforcez votre posture de sécurité avec nos audits complets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-gray-100 transition-colors"
              >
                Demander un audit
              </Link>
              <Link 
                href="#methodologie"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
              >
                Notre méthodologie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Types d'audits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types d&apos;audits proposés
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nous adaptons nos audits à vos besoins spécifiques et à votre secteur d&apos;activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Audit Infrastructure */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Audit Infrastructure
              </h3>
              <p className="text-gray-600 mb-4">
                Évaluation complète de votre architecture réseau, serveurs, et systèmes critiques.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Configuration des firewalls</li>
                <li>• Segmentation réseau</li>
                <li>• Gestion des accès</li>
                <li>• Hardening des serveurs</li>
              </ul>
            </div>

            {/* Audit Applications */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <Search className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Audit Applications
              </h3>
              <p className="text-gray-600 mb-4">
                Analyse de la sécurité de vos applications web, mobiles et métier.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Code source statique</li>
                <li>• Tests dynamiques</li>
                <li>• Architecture applicative</li>
                <li>• API et services</li>
              </ul>
            </div>

            {/* Audit Conformité */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Audit Conformité
              </h3>
              <p className="text-gray-600 mb-4">
                Vérification de votre conformité aux standards et réglementations.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• RGPD / GDPR</li>
                <li>• ISO 27001</li>
                <li>• PCI-DSS</li>
                <li>• Sectorielles (santé, finance)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Méthodologie */}
      <section id="methodologie" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre méthodologie
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un processus structuré en 5 phases pour garantir la qualité et l&apos;exhaustivité de nos audits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Phase 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold">Cadrage initial</h3>
              </div>
              <p className="text-gray-600">
                Définition du périmètre, des objectifs et planification de l&apos;audit.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold">Reconnaissance</h3>
              </div>
              <p className="text-gray-600">
                Cartographie des actifs et identification des points d&apos;entrée.
              </p>
            </div>

            {/* Phase 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold">Tests techniques</h3>
              </div>
              <p className="text-gray-600">
                Exécution des tests de sécurité selon les standards reconnus.
              </p>
            </div>

            {/* Phase 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <h3 className="text-lg font-semibold">Analyse des résultats</h3>
              </div>
              <p className="text-gray-600">
                Classification des vulnérabilités et évaluation des risques.
              </p>
            </div>

            {/* Phase 5 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  5
                </div>
                <h3 className="text-lg font-semibold">Rapport final</h3>
              </div>
              <p className="text-gray-600">
                Livraison du rapport détaillé avec recommandations prioritaires.
              </p>
            </div>

            {/* Suivi */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  +
                </div>
                <h3 className="text-lg font-semibold">Suivi post-audit</h3>
              </div>
              <p className="text-gray-600">
                Accompagnement dans la mise en œuvre des correctifs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarification */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tarification transparente
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Des forfaits adaptés à la taille de votre organisation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PME */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">PME</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                2 500€
                <span className="text-lg text-gray-500 font-normal">/ audit</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Jusqu&apos;à 50 postes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>2-3 jours sur site</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Rapport exécutif</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Plan d&apos;action prioritaire</span>
                </li>
              </ul>
              <AddToCartButton
                serviceSlug="audit"
                planName="PME"
                className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Ajouter au panier
              </AddToCartButton>
            </div>

            {/* ETI */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Populaire
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ETI</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                5 900€
                <span className="text-lg text-gray-500 font-normal">/ audit</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Jusqu&apos;à 250 postes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>5-7 jours sur site</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Rapport détaillé</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Suivi post-audit (3 mois)</span>
                </li>
              </ul>
              <AddToCartButton
                serviceSlug="audit"
                planName="ETI"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Ajouter au panier
              </AddToCartButton>
            </div>

            {/* Groupe */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Groupe</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                Sur mesure
                <span className="text-lg text-gray-500 font-normal">/ audit</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Architecture complexe</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Audit multi-sites</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Équipe dédiée</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Accompagnement 6 mois</span>
                </li>
              </ul>
              <Link 
                href="/booking?mode=booking&service=Audit"
                className="block w-full text-center px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Ne laissez pas les failles compromettre votre activité
          </h2>
          <p className="text-xl mb-8">
            Un audit de sécurité régulier est essentiel pour maintenir un niveau de protection optimal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking?mode=booking&service=Audit"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-gray-100 transition-colors"
            >
              <Clock className="mr-2 h-5 w-5" />
              Planifier un audit
            </Link>
            <Link 
              href="/services"
              className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 