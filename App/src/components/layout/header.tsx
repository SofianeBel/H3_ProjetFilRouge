"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, User, LogOut } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

/**
 * Navigation principale du site Cyna
 * Header sticky avec navigation responsive et call-to-actions
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  // Navigation principale - adaptée aux services Cyna
  const navigation = [
    { name: "Services", href: "/services" },
    { name: "Solutions", href: "/solutions" },
    { name: "Blog", href: "/blog" },
    { name: "Réserver", href: "/booking" },
    { name: "Contact", href: "/contact" }
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#111318]/80 backdrop-blur-md border-b border-[#292e38]/50">
      <div className="container-cyna">
        <div className="flex items-center justify-between whitespace-nowrap py-4">
          {/* Logo et nom de la marque */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <Logo className="transition-transform group-hover:scale-105" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
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
                className="transition-colors hover:text-[#A67FFB] text-gray-300 focus-visible"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions et menu mobile */}
          <div className="flex items-center gap-3">
            {/* Boutons d'authentification conditionnels */}
            {status === "loading" ? (
              // État de chargement
              <div className="w-8 h-8 bg-[#292e38] rounded-full animate-pulse" />
            ) : session ? (
              // Utilisateur connecté
              <div className="hidden md:flex items-center gap-3">
                {/* Bouton admin conditionnel */}
                {((session.user as any)?.role === 'ADMIN' || (session.user as any)?.role === 'SUPER_ADMIN') && (
                  <Link
                    href="/admin"
                    className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#292e38] text-gray-300 focus-visible"
                  >
                    Admin
                  </Link>
                )}
                
                {/* Menu utilisateur */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:bg-[#292e38] transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden lg:block">{session.user?.name}</span>
                  </button>
                  
                  {/* Dropdown menu utilisateur */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1f2e] border border-[#292e38] rounded-lg shadow-xl z-50">
                      <div className="p-3 border-b border-[#292e38]">
                        <p className="text-sm font-medium text-white">{session.user?.name}</p>
                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                        <p className="text-xs text-[#A67FFB] mt-1">
                          {(session.user as any)?.role === 'ADMIN' ? 'Administrateur' : 
                           (session.user as any)?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Client'}
                        </p>
                      </div>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#292e38] transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Utilisateur non connecté
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#292e38] text-gray-300 focus-visible"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary focus-visible"
                >
                  S'inscrire
                </Link>
              </div>
            )}
            
            {/* Bouton principal CTA pour clients connectés */}
            {!session && (
              <Link
                href="/contact"
                className="btn-primary focus-visible"
              >
                Nous contacter
              </Link>
            )}

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white focus-visible"
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

        {/* Menu mobile */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-4 pt-4 border-t border-[#292e38]">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-[#A67FFB] transition-colors py-2 focus-visible"
              >
                {item.name}
              </Link>
            ))}
            {/* Lien admin mobile */}
            <Link
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-[#A67FFB] transition-colors py-2 focus-visible"
            >
              Espace Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 