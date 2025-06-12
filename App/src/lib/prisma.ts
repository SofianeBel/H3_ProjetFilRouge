import { PrismaClient } from '@prisma/client'

/**
 * Instance Prisma globale pour éviter les reconnexions multiples
 * en développement avec le hot reload
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 