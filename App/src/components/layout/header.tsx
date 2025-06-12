"use client"

import Link from "next/link"
import { useState } from "react"
// import { useSession, signOut } from "next-auth/react" // Remplacé par notre système
import { useAuth } from "@/context/AuthContext"
import { useScroll } from "@/hooks/use-scroll"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Navigation principale du site Cyna
 * Header avec comportement glassmorphism au scroll
 * - État initial : transparente, intégrée au Hero
 * - Au scroll : floating capsule glassmorphism avec animations fluides
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  
  // Hook personnalisé pour détecter le scroll de façon optimisée
  const isScrolled = useScroll(20, 10) // Seuil 20px, throttle 10ms

  // Navigation principale - adaptée aux services Cyna
  const navigation = [
    { name: "Services", href: "/services" },
    { name: "Solutions", href: "/solutions" },
    { name: "Blog", href: "/blog" },
    { name: "Réserver", href: "/booking" },
    { name: "Contact", href: "/contact" }
  ]

  // Classes CSS dynamiques selon l'état de scroll - avec arrondis conditionnels
  const getHeaderClasses = () => {
    const baseClasses = "fixed top-0 left-0 right-0 z-50"
    
    if (isScrolled) {
      // Mode floating capsule glassmorphism avec arrondis
      return cn(
        baseClasses,
        "glass-navbar-premium glass-transition-ultra"
      )
    } else {
      // Mode glassmorphism cohérent dès le début pour transition fluide
      return cn(
        baseClasses,
        "glass-navbar-premium glass-transition"
      )
    }
  }

  return (
    <motion.header
      className={getHeaderClasses()}
      animate={{
        width: isScrolled ? "calc(100% - 32px)" : "100%",
        marginTop: isScrolled ? "12px" : "0px",
        marginLeft: isScrolled ? "16px" : "0px",
        marginRight: isScrolled ? "16px" : "0px",
        borderRadius: isScrolled ? "24px" : "0px",
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between whitespace-nowrap py-4">
          {/* Logo et nom de la marque */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <Logo className="transition-transform group-hover:scale-105" />
              <h2 className={cn(
                "text-2xl font-bold tracking-tight transition-colors duration-300",
                isScrolled ? "text-gray-900" : "text-white"
              )}>
                Cyna
              </h2>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors duration-300 hover:text-[#6366F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 rounded-md px-2 py-1",
                  isScrolled 
                    ? "text-gray-700 hover:text-[#6366F1]" 
                    : "text-gray-300 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions et menu mobile */}
          <div className="flex items-center gap-3">
            {/* Boutons d'authentification conditionnels */}
            {isLoading ? (
              // État de chargement avec style adaptatif
              <div className={cn(
                "w-8 h-8 rounded-full animate-pulse transition-colors duration-300",
                isScrolled ? "bg-gray-200" : "bg-[#292e38]"
              )} />
            ) : isAuthenticated && user ? (
              // Utilisateur connecté
              <div className="hidden md:flex items-center gap-3">
                {/* Menu utilisateur */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2",
                      isScrolled 
                        ? "text-gray-700 hover:bg-gray-100" 
                        : "text-gray-300 hover:bg-[#292e38]"
                    )}
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden lg:block">{user.name || user.email}</span>
                  </button>
                  
                  {/* Dropdown menu utilisateur avec animation */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-48 glass-dropdown rounded-xl z-50"
                      >
                        <div className="p-3 border-b border-gray-200/50">
                          <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                          <p className="text-xs text-[#6366F1] mt-1">
                            {user.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                          </p>
                        </div>
                        <div className="py-1">
                          {/* Lien Admin si utilisateur est admin */}
                          {user.role === 'ADMIN' && (
                            <Link
                              href="/admin"
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100/70 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Settings className="h-4 w-4" />
                              Espace Admin
                            </Link>
                          )}
                          {/* Bouton déconnexion */}
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100/70 transition-colors rounded-b-xl"
                          >
                            <LogOut className="h-4 w-4" />
                            Se déconnecter
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              // Utilisateur non connecté
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2",
                    isScrolled 
                      ? "text-gray-700 hover:bg-gray-100" 
                      : "text-gray-300 hover:bg-[#292e38]"
                  )}
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isScrolled 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg focus-visible:ring-[#6366F1]" 
                      : "bg-[#A67FFB] text-white hover:bg-[#9570E6] focus-visible:ring-[#A67FFB]"
                  )}
                >
                  S'inscrire
                </Link>
              </div>
            )}
            
            {/* Bouton principal CTA pour clients non connectés */}
            {!isAuthenticated && (
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isScrolled 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg focus-visible:ring-[#6366F1]" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg focus-visible:ring-[#6366F1]"
                )}
              >
                Nous contacter
              </Link>
            )}

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "md:hidden p-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 rounded-md",
                isScrolled 
                  ? "text-gray-700 hover:text-gray-900" 
                  : "text-gray-300 hover:text-white"
              )}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile avec animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden overflow-hidden"
            >
              <nav className={cn(
                "flex flex-col gap-4 pt-4 border-t pb-4",
                isScrolled ? "border-gray-200/50" : "border-[#292e38]"
              )}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "transition-colors duration-300 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 rounded-md px-2",
                      isScrolled 
                        ? "text-gray-700 hover:text-[#6366F1]" 
                        : "text-gray-900 hover:text-[#A67FFB]"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Section profil utilisateur pour mobile */}
                {isAuthenticated && user ? (
                  <div className={cn(
                    "border-t pt-4 mt-4",
                    isScrolled ? "border-gray-200/50" : "border-[#292e38]"
                  )}>
                    {/* Informations utilisateur */}
                    <div className={cn(
                      "px-2 py-3 rounded-lg mb-3",
                      isScrolled ? "bg-gray-50" : "bg-[#292e38]/30"
                    )}>
                      <div className="flex items-center gap-3">
                        <User className={cn(
                          "h-8 w-8 p-1.5 rounded-full",
                          isScrolled ? "bg-gray-200 text-gray-600" : "bg-[#A67FFB] text-white"
                        )} />
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            isScrolled ? "text-gray-900" : "text-gray-900"
                          )}>
                            {user.name || user.email}
                          </p>
                          <p className={cn(
                            "text-xs",
                            isScrolled ? "text-gray-600" : "text-gray-700"
                          )}>
                            {user.email}
                          </p>
                          <p className="text-xs text-[#6366F1] mt-0.5">
                            {user.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lien admin mobile (si admin) */}
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 transition-colors duration-300 py-2 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 rounded-md",
                          isScrolled 
                            ? "text-gray-700 hover:text-[#6366F1]" 
                            : "text-gray-900 hover:text-[#A67FFB]"
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        Espace Admin
                      </Link>
                    )}
                    
                    {/* Bouton déconnexion mobile */}
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 transition-colors duration-300 py-2 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 rounded-md",
                        isScrolled 
                          ? "text-gray-700 hover:text-red-600" 
                          : "text-gray-900 hover:text-red-600"
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  // Section authentification pour utilisateurs non connectés en mobile
                  <div className={cn(
                    "border-t pt-4 mt-4 flex flex-col gap-3",
                    isScrolled ? "border-gray-200/50" : "border-[#292e38]"
                  )}>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "text-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2",
                        isScrolled 
                          ? "text-gray-700 hover:bg-gray-100 border border-gray-300" 
                          : "text-gray-900 hover:bg-gray-100 border border-gray-400"
                      )}
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "text-center inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        isScrolled 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg focus-visible:ring-[#6366F1]" 
                          : "bg-[#A67FFB] text-white hover:bg-[#9570E6] focus-visible:ring-[#A67FFB]"
                      )}
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
} 