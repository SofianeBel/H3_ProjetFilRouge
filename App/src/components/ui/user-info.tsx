'use client'

import { useAuth } from '@/context/AuthContext'
import { User, LogOut, Loader2 } from 'lucide-react'

/**
 * Composant pour afficher les informations de l'utilisateur connecté
 * et permettre la déconnexion
 */
export function UserInfo() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-400">Vérification...</span>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
        <span className="text-sm text-gray-400">Non connecté</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg">
      {/* Icône utilisateur */}
      <div className="flex items-center justify-center w-8 h-8 bg-violet-600 rounded-full">
        <User className="h-4 w-4 text-white" />
      </div>
      
      {/* Informations utilisateur */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">
          {user.name || user.email}
        </span>
        <span className="text-xs text-gray-400">
          {user.role === 'ADMIN' ? '🔧 Admin' : '👤 Client'} • {user.email}
        </span>
      </div>
      
      {/* Bouton déconnexion */}
      <button
        onClick={logout}
        className="ml-2 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Se déconnecter"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
}

/**
 * Version compacte pour navigation
 */
export function UserInfoCompact() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()

  if (isLoading) {
    return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
  }

  if (!isAuthenticated || !user) {
    return (
      <span className="text-sm text-gray-400">
        Non connecté
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-white font-medium">
        {user.name || user.email}
      </span>
      <button
        onClick={logout}
        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
        title="Se déconnecter"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
} 