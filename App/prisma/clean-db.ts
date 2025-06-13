import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
  try {
    // Supprimer les données dans l'ordre pour respecter les contraintes de clés étrangères
    await prisma.post.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('✅ Base de données nettoyée avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase() 