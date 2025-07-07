// Script temporaire pour créer un utilisateur de test
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('test123456', 12)
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@cyna-it.fr',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    })
    
    console.log('✅ Utilisateur créé:', user.email)
    console.log('📧 Email: test@cyna-it.fr')
    console.log('🔑 Mot de passe: test123456')
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('👤 Utilisateur existe déjà: test@cyna-it.fr')
    } else {
      console.error('❌ Erreur:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser() 