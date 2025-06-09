declare module "next-auth" {
  /**
   * Étendre l'interface User pour inclure le rôle
   */
  interface User {
    role?: string
  }

  /**
   * Étendre l'interface Session pour inclure le rôle utilisateur
   */
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  /**
   * Étendre l'interface JWT pour inclure le rôle
   */
  interface JWT {
    role?: string
  }
} 