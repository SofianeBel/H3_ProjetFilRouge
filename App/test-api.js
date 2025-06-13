// Script de test pour vérifier l'API plans
async function testAPI() {
  console.log('🧪 Test de l\'API /api/services/audit/plans')
  
  try {
    const response = await fetch('http://localhost:3000/api/services/audit/plans')
    const data = await response.json()
    
    console.log('📊 Statut:', response.status)
    console.log('📦 Réponse:', JSON.stringify(data, null, 2))
    
    if (response.ok && data.success) {
      console.log('✅ API fonctionne correctement!')
      console.log(`🎯 ${data.data.plans.length} plans trouvés pour le service ${data.data.service.name}`)
    } else {
      console.log('❌ Erreur API:', data.message)
    }
    
  } catch (error) {
    console.log('💥 Erreur réseau:', error.message)
  }
}

// Attendre un peu que le serveur démarre
setTimeout(testAPI, 3000) 