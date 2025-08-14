'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  CheckCircle, 
  Home, 
  Package, 
  Calendar,
  ArrowRight,
  Download,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

/**
 * Page de succès après paiement
 * Affichée après un paiement réussi via Stripe
 */
export default function OrderSuccessPage() {
  const { user } = useAuth()
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Récupération des paramètres de l'URL
  const sessionId = searchParams.get('session_id')
  const paymentIntentId = searchParams.get('payment_intent')

  useEffect(() => {
    // Vider le panier une fois le paiement confirmé
    clearCart()
    
    // Simuler un chargement des détails de commande
    // En réalité, on pourrait faire un appel API pour récupérer les détails
    if (sessionId || paymentIntentId) {
      setTimeout(() => {
        setOrderDetails({
          id: paymentIntentId?.slice(-8) || 'UNKNOWN',
          amount: 12000, // Exemple: 120€
          currency: 'eur'
        })
        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }, [sessionId, paymentIntentId, clearCart])

  /**
   * Formatage du prix en euros
   */
  const formatPrice = (priceInCents: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceInCents / 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6B8DE5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Confirmation de votre commande...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de succès */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 py-12">
        <div className="container-cyna">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="h-24 w-24 text-white" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Commande confirmée !
            </h1>
            <p className="text-xl text-green-100 mb-6">
              Merci pour votre confiance. Votre paiement a été traité avec succès.
            </p>
            
            {orderDetails && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
                <p className="text-green-50 mb-2">Commande #{orderDetails.id.toUpperCase()}</p>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(orderDetails.amount)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container-cyna py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Étapes suivantes */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Que se passe-t-il maintenant ?
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Confirmation par email
                      </h3>
                      <p className="text-gray-600">
                        Vous allez recevoir un email de confirmation avec tous les détails de votre commande dans les prochaines minutes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Prise de contact
                      </h3>
                      <p className="text-gray-600">
                        Notre équipe va vous contacter sous 24-48h pour planifier la mise en place de votre service de cybersécurité.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Configuration et déploiement
                      </h3>
                      <p className="text-gray-600">
                        Nous configurons votre service selon vos besoins spécifiques et procédons au déploiement sécurisé.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Service opérationnel
                      </h3>
                      <p className="text-gray-600">
                        Votre service de cybersécurité est actif et notre équipe assure un suivi continu pour garantir votre protection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations importantes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Informations importantes
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• Votre facture sera disponible dans votre espace client</li>
                  <li>• Nos services sont couverts par notre garantie de satisfaction</li>
                  <li>• Un support technique est disponible 24h/24 et 7j/7</li>
                  <li>• Vous pouvez suivre l'avancement dans votre tableau de bord</li>
                </ul>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions rapides
                </h3>
                
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#6B8DE5] text-white rounded-lg hover:bg-[#5A7BD4] transition-colors"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Retour à l'accueil
                  </Link>
                  
                  <Link
                    href="/orders"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Mes commandes
                  </Link>
                  
                  <Link
                    href="/booking"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Prendre rendez-vous
                  </Link>
                  
                  {user && (
                    <Link
                      href="/profile"
                      className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Mon profil
                    </Link>
                  )}
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Besoin d'aide ?
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Notre équipe support est disponible pour répondre à toutes vos questions.
                </p>
                
                <Link
                  href="/booking?mode=message"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Contacter le support
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>

              {/* Recommandations */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Services complémentaires
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Renforcez votre sécurité avec nos autres services.
                </p>
                
                <Link
                  href="/services"
                  className="w-full inline-flex items-center justify-center px-4 py-3 border border-[#6B8DE5] text-[#6B8DE5] rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Découvrir nos services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de remerciement */}
      <div className="bg-gray-900 py-8">
        <div className="container-cyna">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Merci de faire confiance à Cyna
            </h3>
            <p className="text-gray-300">
              Votre sécurité est notre priorité. Nous sommes ravis de vous accompagner dans la protection de vos données.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

