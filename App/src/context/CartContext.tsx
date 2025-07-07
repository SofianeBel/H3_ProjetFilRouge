'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

/**
 * Interface pour un item du panier
 */
export interface CartItem {
  serviceId: string
  serviceName: string
  serviceSlug: string
  price: number // Prix en centimes
  currency: string
  quantity: number
  stripeProductId?: string
  stripePriceId?: string
}

/**
 * Interface pour le contexte du panier
 */
interface CartContextType {
  cart: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (serviceId: string) => void
  updateQuantity: (serviceId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (serviceId: string) => boolean
  getCartItem: (serviceId: string) => CartItem | undefined
}

// Création du contexte
const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Hook pour utiliser le contexte du panier
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider')
  }
  return context
}

/**
 * Clé pour le localStorage
 */
const CART_STORAGE_KEY = 'cyna-cart'

/**
 * Provider du contexte panier
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Chargement initial depuis localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[]
        setCart(parsedCart)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
      // En cas d'erreur, on repart avec un panier vide
      localStorage.removeItem(CART_STORAGE_KEY)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Sauvegarde dans localStorage à chaque modification du panier
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error)
      }
    }
  }, [cart, isLoaded])

  /**
   * Ajouter un item au panier
   * Si l'item existe déjà, on incrémente la quantité
   */
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.serviceId === newItem.serviceId)
      
      if (existingItemIndex >= 0) {
        // L'item existe déjà, on incrémente la quantité
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        }
        return updatedCart
      } else {
        // Nouvel item, on l'ajoute avec quantity = 1
        return [...prevCart, { ...newItem, quantity: 1 }]
      }
    })
  }

  /**
   * Supprimer un item du panier
   */
  const removeItem = (serviceId: string) => {
    setCart(prevCart => prevCart.filter(item => item.serviceId !== serviceId))
  }

  /**
   * Mettre à jour la quantité d'un item
   * Si quantity <= 0, on supprime l'item
   */
  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(serviceId)
      return
    }

    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.serviceId === serviceId
          ? { ...item, quantity }
          : item
      )
      return updatedCart
    })
  }

  /**
   * Vider le panier
   */
  const clearCart = () => {
    setCart([])
  }

  /**
   * Obtenir le nombre total d'items dans le panier
   */
  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  /**
   * Obtenir le prix total du panier en centimes
   */
  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  /**
   * Vérifier si un service est dans le panier
   */
  const isInCart = (serviceId: string): boolean => {
    return cart.some(item => item.serviceId === serviceId)
  }

  /**
   * Obtenir un item du panier par serviceId
   */
  const getCartItem = (serviceId: string): CartItem | undefined => {
    return cart.find(item => item.serviceId === serviceId)
  }

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getCartItem
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
} 