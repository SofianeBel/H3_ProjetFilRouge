// Script pour vérifier l'utilisateur de test
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test@cyna-it.fr' }
    })
    
    if (user) {
      console.log('✅ Utilisateur trouvé:', user.email)
      console.log('📧 Email:', user.email)
      console.log('👤 Nom:', user.name)
      console.log('🔑 A un mot de passe:', !!user.password)
      console.log('🎭 Rôle:', user.role)
      
      // Test du mot de passe
      if (user.password) {
        const isValid = await bcrypt.compare('test123456', user.password)
        console.log('🔓 Mot de passe valide:', isValid)
      }
    } else {
      console.log('❌ Utilisateur non trouvé!')
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser() 