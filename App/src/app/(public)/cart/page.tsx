'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, CheckCircle, Home } from 'lucide-react'
import { useCart } from '@/context/CartContext'

/**
 * Page du panier
 * Affiche les items du panier avec possibilité de modifier les quantités
 * et de procéder au paiement
 */
export default function CartPage() {
  const router = useRouter()
  const { 
    cart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart()
  
  const [isLoading, setIsLoading] = useState(false)

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
   * Redirection vers la page de checkout avancée
   */
  const handleCheckout = () => {
    if (cart.length === 0) return
    router.push('/checkout')
  }



  // Si le panier est vide
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-cyna">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez nos services de cybersécurité et ajoutez-les à votre panier.
            </p>
            <Link 
              href="/services"
              className="inline-flex items-center px-6 py-3 bg-[#6B8DE5] text-white font-semibold rounded-lg hover:bg-[#5A7BD4] transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voir nos services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-cyna">
        <div className="max-w-4xl mx-auto">
          {/* Header avec navigation - User Story 8.c */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Accueil
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  href="/services"
                  className="inline-flex items-center text-[#6B8DE5] hover:text-[#5A7BD4] font-medium"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continuer mes achats
                </Link>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mon panier ({getTotalItems()} article{getTotalItems() > 1 ? 's' : ''})
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.serviceId} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                        {/* Info du service */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.serviceName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Service de cybersécurité
                          </p>
                          <p className="text-lg font-bold text-[#6B8DE5] mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Contrôles quantité */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity <= 1}
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Prix total pour cet item */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Bouton supprimer */}
                        <button
                          onClick={() => removeItem(item.serviceId)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          aria-label="Supprimer cet article"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Actions sur le panier */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Vider le panier
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé et checkout */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Résumé de la commande
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA (20%)</span>
                    <span>{formatPrice(Math.round(getTotalPrice() * 0.2))}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total TTC</span>
                      <span>{formatPrice(Math.round(getTotalPrice() * 1.2))}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isLoading || cart.length === 0}
                  className="w-full flex items-center justify-center px-6 py-3 bg-[#6B8DE5] text-white font-semibold rounded-lg hover:bg-[#5A7BD4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Redirection...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Confirmer ma commande
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Paiement sécurisé par Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
} 