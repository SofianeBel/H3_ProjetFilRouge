'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

/**
 * Composant bouton panier pour la navbar
 * Affiche l'icône du panier avec un badge indiquant le nombre d'items
 */
interface CartButtonProps {
  isScrolled?: boolean
}

export const CartButton: React.FC<CartButtonProps> = ({ isScrolled = false }) => {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <Link 
      href="/cart"
      className={cn(
        "relative inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2",
        isScrolled 
          ? "text-gray-700 hover:text-[#6366F1] hover:bg-gray-100" 
          : "text-gray-300 hover:text-white hover:bg-[#292e38]"
      )}
      aria-label={`Panier (${totalItems} article${totalItems > 1 ? 's' : ''})`}
    >
      <ShoppingCart className="h-6 w-6" />
      
      {/* Badge avec le nombre d'items */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#6366F1] rounded-full min-w-[20px] h-5">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  )
}

/**
 * Version compacte du bouton panier (pour mobile)
 */
export const CartButtonCompact: React.FC<CartButtonProps> = ({ isScrolled = false }) => {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <Link 
      href="/cart"
      className={cn(
        "relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2",
        isScrolled 
          ? "text-gray-700 hover:text-[#6366F1] hover:bg-gray-100" 
          : "text-gray-300 hover:text-white hover:bg-[#292e38]"
      )}
      aria-label={`Panier (${totalItems} article${totalItems > 1 ? 's' : ''})`}
    >
      <ShoppingCart className="h-5 w-5" />
      
      {/* Badge avec le nombre d'items */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-[#6366F1] rounded-full min-w-[18px] h-4">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  )
} 