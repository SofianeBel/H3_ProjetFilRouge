import { PrismaClient } from '@prisma/client'

/**
 * Configuration du client Prisma pour Next.js
 * Utilise une instance globale pour éviter les multiples connexions en développement
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

// En développement, on stocke l'instance dans une variable globale
// pour éviter les reconnexions multiples dues au hot-reloading
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} 