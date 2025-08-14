'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useSession } from 'next-auth/react'

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
 * Clés pour le localStorage
 */
const CART_STORAGE_KEY_ANONYMOUS = 'cyna-cart-anonymous'
const CART_STORAGE_KEY_USER = 'cyna-cart-user-'

/**
 * Provider du contexte panier
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { data: session, status } = useSession()

  // Fonction pour obtenir la clé de stockage appropriée
  const getStorageKey = useCallback((): string => {
    if (session?.user?.id) {
      return `${CART_STORAGE_KEY_USER}${session.user.id}`
    }
    return CART_STORAGE_KEY_ANONYMOUS
  }, [session?.user?.id])

  // Chargement initial depuis localStorage avec prise en compte de l'authentification
  useEffect(() => {
    if (status === 'loading') return // Attendre que l'état de session soit connu

    try {
      const storageKey = getStorageKey()
      const savedCart = localStorage.getItem(storageKey)
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[]
        setCart(parsedCart)
        console.log(`📦 Panier chargé depuis ${storageKey}:`, parsedCart.length, 'articles')
      } else {
        // Si pas de panier pour cet utilisateur, commencer avec un panier vide
        setCart([])
        console.log(`📦 Nouveau panier créé pour ${storageKey}`)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
      // En cas d'erreur, on repart avec un panier vide
      const storageKey = getStorageKey()
      localStorage.removeItem(storageKey)
      setCart([])
    } finally {
      setIsLoaded(true)
    }
  }, [session, status, getStorageKey])

  // Sauvegarde dans localStorage à chaque modification du panier
  useEffect(() => {
    if (isLoaded && status !== 'loading') {
      try {
        const storageKey = getStorageKey()
        localStorage.setItem(storageKey, JSON.stringify(cart))
        console.log(`💾 Panier sauvegardé dans ${storageKey}:`, cart.length, 'articles')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error)
      }
    }
  }, [cart, isLoaded, session, status, getStorageKey])

  // Gérer la transition déconnexion : vider le panier visible mais garder le panier utilisateur
  useEffect(() => {
    if (status === 'unauthenticated' && isLoaded) {
      // L'utilisateur vient de se déconnecter, charger le panier anonyme
      try {
        const anonymousCart = localStorage.getItem(CART_STORAGE_KEY_ANONYMOUS)
        if (anonymousCart) {
          const parsedCart = JSON.parse(anonymousCart) as CartItem[]
          setCart(parsedCart)
          console.log('🔄 Passage au panier anonyme:', parsedCart.length, 'articles')
        } else {
          setCart([])
          console.log('🔄 Panier vidé après déconnexion')
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier anonyme:', error)
        setCart([])
      }
    }
  }, [status, isLoaded])

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
   * Migrer le panier anonyme vers l'utilisateur connecté
   * Utilisé quand un utilisateur se connecte avec des articles dans le panier anonyme
   */
  const migrateAnonymousCart = useCallback(() => {
    if (!session?.user?.id) return

    try {
      const anonymousCart = localStorage.getItem(CART_STORAGE_KEY_ANONYMOUS)
      if (anonymousCart) {
        const anonymousItems = JSON.parse(anonymousCart) as CartItem[]
        if (anonymousItems.length > 0) {
          // Fusionner avec le panier existant de l'utilisateur
          setCart(prevCart => {
            const mergedCart = [...prevCart]
            
            anonymousItems.forEach(anonymousItem => {
              const existingIndex = mergedCart.findIndex(item => 
                item.serviceId === anonymousItem.serviceId
              )
              
              if (existingIndex >= 0) {
                // L'article existe déjà, additionner les quantités
                mergedCart[existingIndex].quantity += anonymousItem.quantity
              } else {
                // Nouvel article, l'ajouter
                mergedCart.push(anonymousItem)
              }
            })
            
            return mergedCart
          })
          
          // Nettoyer le panier anonyme après migration
          localStorage.removeItem(CART_STORAGE_KEY_ANONYMOUS)
          console.log(`🔄 Panier anonyme migré vers l'utilisateur ${session.user.id}:`, anonymousItems.length, 'articles')
        }
      }
    } catch (error) {
      console.error('Erreur lors de la migration du panier anonyme:', error)
    }
  }, [session?.user?.id])

  // Déclencher la migration quand l'utilisateur se connecte
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id && isLoaded) {
      // Délai pour s'assurer que le panier utilisateur est chargé
      setTimeout(migrateAnonymousCart, 100)
    }
  }, [status, session?.user?.id, isLoaded, migrateAnonymousCart])

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