'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, 
  Home, 
  ArrowLeft, 
  CreditCard, 
  CheckCircle, 
  Shield,
  Truck,
  Clock,
  AlertCircle,
  Euro,
  User,
  Building,
  Mail,
  Phone
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

/**
 * Page de checkout - Confirmation de commande
 * User Stories 8.a, 8.c, 8.d
 */
export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { 
    cart, 
    getTotalItems, 
    getTotalPrice,
    clearCart 
  } = useCart()
  
  const [isLoading, setIsLoading] = useState(false)
  const [billingInfo, setBillingInfo] = useState({
    company: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  })

  // Rediriger si le panier est vide
  useEffect(() => {
    if (!isAuthLoading && cart.length === 0) {
      router.push('/cart')
    }
  }, [cart.length, router, isAuthLoading])

  /**
   * Formatage du prix en euros
   */
  const formatPrice = (priceInCents: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceInCents / 100)
  }

  /**
   * Gestion du paiement final
   */
  const handleFinalPayment = async () => {
    if (!user) {
      router.push('/auth/login?callbackUrl=/checkout')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart,
          billingInfo: billingInfo
        })
      })

      const data = await response.json()

      if (response.status === 401) {
        router.push('/auth/login?callbackUrl=/checkout')
        return
      }

      if (data.success && data.data?.url) {
        // Redirection vers Stripe Checkout
        window.location.href = data.data.url
      } else {
        console.error('Erreur checkout:', data.message)
        alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Erreur checkout:', error)
      alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  // Chargement
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6B8DE5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Redirection si non connecté
  if (!user) {
    router.push('/auth/login?callbackUrl=/checkout')
    return null
  }

  // Redirection si panier vide
  if (cart.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-cyna">
        <div className="max-w-6xl mx-auto">
          {/* Navigation - User Story 8.c */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Link 
                href="/"
                className="inline-flex items-center space-x-1 hover:text-gray-900 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </Link>
              <span>•</span>
              <Link 
                href="/cart"
                className="inline-flex items-center space-x-1 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Panier</span>
              </Link>
              <span>•</span>
              <span className="text-gray-900">Confirmation de commande</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Confirmer votre commande
            </h1>
            <p className="text-gray-600">
              Vérifiez les détails de votre commande avant de procéder au paiement sécurisé
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Détails de la commande - User Story 8.a */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Récapitulatif des services */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Récapitulatif de votre commande ({getTotalItems()} service{getTotalItems() > 1 ? 's' : ''})
                </h2>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.serviceId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.serviceName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.planName}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Quantité: {item.quantity}</span>
                          <span>•</span>
                          <span>Prix unitaire: {formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informations de livraison/service */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Modalités de service
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Délai de mise en service</h3>
                      <p className="text-sm text-gray-600">24-48h après confirmation du paiement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Configuration sécurisée</h3>
                      <p className="text-sm text-gray-600">Déploiement selon les standards Cyna</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <User className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Support dédié</h3>
                      <p className="text-sm text-gray-600">Accompagnement par nos experts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Garantie de service</h3>
                      <p className="text-sm text-gray-600">SLA garanti selon votre plan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de facturation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Informations de facturation
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{user.name || 'Non renseigné'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={billingInfo.company}
                      onChange={(e) => setBillingInfo({...billingInfo, company: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <select
                      value={billingInfo.country}
                      onChange={(e) => setBillingInfo({...billingInfo, country: e.target.value})}
                      title="Sélectionner le pays de facturation"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B8DE5] focus:border-transparent"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé et paiement */}
            <div className="space-y-6">
              
              {/* Résumé financier */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Euro className="h-5 w-5 mr-2" />
                  Résumé financier
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total HT :</span>
                    <span>{formatPrice(Math.round(getTotalPrice() / 1.2))}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA (20%) :</span>
                    <span>{formatPrice(getTotalPrice() - Math.round(getTotalPrice() / 1.2))}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total TTC :</span>
                      <span className="text-[#6B8DE5]">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleFinalPayment}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-6 py-4 bg-[#6B8DE5] text-white font-semibold rounded-lg hover:bg-[#5A7BD4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Redirection...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Procéder au paiement
                      </>
                    )}
                  </button>
                  
                  <Link
                    href="/cart"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Modifier mon panier
                  </Link>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Paiement 100% sécurisé par Stripe
                </p>
              </div>

              {/* Garanties */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Nos garanties
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Paiement sécurisé</p>
                      <p className="text-xs text-gray-600">Chiffrement SSL et conformité PCI-DSS</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Satisfaction garantie</p>
                      <p className="text-xs text-gray-600">30 jours satisfait ou remboursé</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Support expert</p>
                      <p className="text-xs text-gray-600">Assistance 24h/24 et 7j/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liens utiles */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Liens utiles</h4>
                <div className="space-y-2">
                  <Link 
                    href="/orders"
                    className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    → Consulter mes commandes précédentes
                  </Link>
                  <Link 
                    href="/booking?mode=message"
                    className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    → Contacter notre équipe
                  </Link>
                  <Link 
                    href="/legal/terms"
                    className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    → Conditions générales de vente
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Informations importantes */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900 mb-2">Important à savoir</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Après paiement, vous recevrez une confirmation par email avec tous les détails</li>
                  <li>• Notre équipe vous contactera dans les 24-48h pour planifier la mise en service</li>
                  <li>• Les services sont activés uniquement après validation du paiement</li>
                  <li>• En cas de problème, notre support est disponible 24h/24</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}