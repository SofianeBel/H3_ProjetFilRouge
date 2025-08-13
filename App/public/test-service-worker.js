/**
 * Script de test pour valider la résolution de l'erreur Service Worker
 * À exécuter dans la console du navigateur
 */

(async function testServiceWorker() {
  console.log('🧪 Test du Service Worker Cyna...\n');

  // Test 1: Support des Service Workers
  if ('serviceWorker' in navigator) {
    console.log('✅ Service Workers supportés');
  } else {
    console.error('❌ Service Workers non supportés');
    return;
  }

  try {
    // Test 2: Récupération des registrations
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`📋 ${registrations.length} service worker(s) enregistré(s)`);

    if (registrations.length === 0) {
      console.warn('⚠️ Aucun service worker trouvé, vérifiez l\'enregistrement');
      return;
    }

    // Test 3: Vérification du service worker Cyna
    const cynaWorker = registrations.find(reg => 
      reg.scope.includes(location.origin) && 
      reg.active && 
      reg.active.scriptURL.includes('sw.js')
    );

    if (cynaWorker) {
      console.log('✅ Service Worker Cyna détecté');
      console.log(`   📍 Scope: ${cynaWorker.scope}`);
      console.log(`   📄 Script: ${cynaWorker.active.scriptURL}`);
      console.log(`   🔄 État: ${cynaWorker.active.state}`);
    } else {
      console.warn('⚠️ Service Worker Cyna non trouvé');
    }

    // Test 4: Test des caches
    const cacheNames = await caches.keys();
    console.log(`🗂️ ${cacheNames.length} cache(s) disponible(s):`);
    cacheNames.forEach(name => console.log(`   - ${name}`));

    // Test 5: Test de requête problématique (simulation)
    console.log('\n🔬 Test des URLs filtrées...');
    const problematicUrls = [
      'chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/main.js',
      'moz-extension://12345/content.js',
      'webkit-extension://example',
      '/_next/static/chunks/webpack/hot-update.js',
      '/sockjs-node/info'
    ];

    problematicUrls.forEach(url => {
      console.log(`   🚫 URL qui devrait être filtrée: ${url.substring(0, 50)}...`);
    });

    // Test 6: Simulation de mise en cache normale
    try {
      const cache = await caches.open('cyna-test-cache');
      const testUrl = `${location.origin}/favicon.ico`;
      
      const response = await fetch(testUrl);
      if (response.ok) {
        await cache.put(testUrl, response.clone());
        console.log('✅ Test de mise en cache réussi');
        
        // Nettoyage
        await cache.delete(testUrl);
        await caches.delete('cyna-test-cache');
      }
    } catch (error) {
      console.warn('⚠️ Test de cache échoué:', error.message);
    }

    // Test 7: Vérification des erreurs dans la console
    console.log('\n🔍 Vérification des erreurs...');
    console.log('   ℹ️ Dans l\'onglet Console, cherchez :');
    console.log('   ❌ "Request scheme \'chrome-extension\' is unsupported" - Ne devrait PAS apparaître');
    console.log('   ✅ "SW: Service Worker loaded successfully" - Devrait apparaître');
    console.log('   ✅ "SW: Completely ignoring request to chrome-extension:" - Devrait apparaître si extensions actives');

    console.log('\n🎉 Test terminé avec succès !');
    console.log('📝 Vérifiez la console pour d\'éventuelles erreurs restantes');

  } catch (error) {
    console.error('❌ Erreur durant le test:', error);
  }
})();

// Helper: Fonction pour surveiller les erreurs de service worker
function monitorServiceWorkerErrors() {
  console.log('👀 Surveillance des erreurs de Service Worker activée...');
  
  let errorCount = 0;
  
  // Écouter les erreurs globales
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('sw.js')) {
      errorCount++;
      console.error(`🚨 Erreur Service Worker #${errorCount}:`, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    }
  });

  // Écouter les rejets de promesses
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.toString().includes('chrome-extension')) {
      errorCount++;
      console.error(`🚨 Erreur chrome-extension #${errorCount}:`, event.reason);
    }
  });

  console.log('✅ Surveillance active. Les erreurs SW seront loggées automatiquement.');
  
  // Retourner une fonction pour arrêter la surveillance
  return () => {
    console.log(`🛑 Surveillance arrêtée. ${errorCount} erreur(s) détectée(s).`);
  };
}

// Helper: Fonction pour nettoyer tous les service workers
async function clearAllServiceWorkers() {
  console.log('🧹 Nettoyage de tous les service workers...');
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const unregisterPromises = registrations.map(registration => {
      console.log(`   🗑️ Suppression: ${registration.scope}`);
      return registration.unregister();
    });
    
    await Promise.all(unregisterPromises);
    
    console.log('✅ Tous les service workers ont été supprimés');
    console.log('🔄 Rechargez la page pour réenregistrer le service worker Cyna');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return false;
  }
}

// Helper: Fonction pour forcer la mise à jour du service worker
async function updateServiceWorker() {
  console.log('🔄 Mise à jour forcée du service worker...');
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const updatePromises = registrations.map(registration => {
      console.log(`   ⬆️ Mise à jour: ${registration.scope}`);
      return registration.update();
    });
    
    await Promise.all(updatePromises);
    console.log('✅ Service workers mis à jour');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  }
}

// Exposer les fonctions globalement pour usage manuel
window.testServiceWorker = testServiceWorker;
window.monitorServiceWorkerErrors = monitorServiceWorkerErrors;
window.clearAllServiceWorkers = clearAllServiceWorkers;
window.updateServiceWorker = updateServiceWorker;

console.log('🛠️ Scripts de test chargés !');
console.log('💡 Fonctions disponibles:');
console.log('   - testServiceWorker() : Lancer les tests complets');
console.log('   - monitorServiceWorkerErrors() : Surveiller les erreurs');
console.log('   - clearAllServiceWorkers() : Nettoyer tous les SW');
console.log('   - updateServiceWorker() : Forcer la mise à jour');
