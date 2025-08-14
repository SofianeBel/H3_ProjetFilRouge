# 🧪 Test Rapide - Service Worker

## ⚡ Test immédiat dans la console

### 1. Charger le script de test
```javascript
// Dans la console du navigateur (F12)
const script = document.createElement('script');
script.src = '/test-service-worker.js';
document.head.appendChild(script);
```

### 2. Lancer les tests
```javascript
// Attendre 2 secondes puis lancer
setTimeout(() => {
  testServiceWorker();
}, 2000);
```

### 3. Surveiller les erreurs en temps réel
```javascript
// Activer la surveillance
const stopMonitoring = monitorServiceWorkerErrors();

// Pour arrêter plus tard
// stopMonitoring();
```

## ✅ Ce qu'il faut voir

### Console - Messages attendus
- ✅ `SW: Service Worker loaded successfully`
- ✅ `SW: Installing...` 
- ✅ `SW: Activating...`
- ✅ `SW: Completely ignoring request to chrome-extension:` (si extensions actives)
- ❌ **NE DOIT PAS** voir : `Request scheme 'chrome-extension' is unsupported`

### DevTools > Application > Service Workers
- ✅ Service worker actif avec scope `/`
- ✅ Status "running" ou "activated"
- ✅ Source: `/sw.js`

### DevTools > Application > Storage > Cache Storage
- ✅ Présence de caches `cyna-*`
- ✅ Ressources mises en cache (favicon.ico au minimum)

## 🛠️ Dépannage rapide

### Si l'erreur persiste
```javascript
// 1. Nettoyer tous les service workers
await clearAllServiceWorkers();

// 2. Recharger la page
location.reload();

// 3. Attendre et retester
setTimeout(() => testServiceWorker(), 3000);
```

### Si le service worker ne s'installe pas
```javascript
// Vérifier les erreurs d'installation
navigator.serviceWorker.getRegistrations()
  .then(regs => {
    regs.forEach(reg => {
      console.log('SW:', reg.scope, reg.installing, reg.waiting, reg.active);
    });
  });
```

### Si la console montre encore des erreurs
1. **Vérifier les extensions** : Désactiver temporairement React DevTools
2. **Vider le cache** : Ctrl+Shift+R (hard reload)
3. **Mode incognito** : Tester dans une fenêtre privée

## 📊 Validation complète

```javascript
// Script de validation complète
(async function fullValidation() {
  console.log('🔍 Validation complète...');
  
  // 1. Test service worker
  await testServiceWorker();
  
  // 2. Test de navigation
  console.log('🌐 Test de navigation...');
  const testUrls = ['/', '/about', '/services'];
  for (const url of testUrls) {
    try {
      const response = await fetch(url);
      console.log(`✅ ${url}: ${response.status}`);
    } catch (error) {
      console.error(`❌ ${url}: ${error.message}`);
    }
  }
  
  // 3. Test de cache
  console.log('💾 Test de cache...');
  const cacheNames = await caches.keys();
  console.log(`Caches actifs: ${cacheNames.join(', ')}`);
  
  console.log('🎉 Validation terminée !');
})();
```

## 🚀 Résultats attendus

- **Zéro erreur** `chrome-extension` dans la console
- **Service worker** actif et fonctionnel
- **Cache** des ressources statiques opérationnel
- **Navigation** fluide sans interruption

---

**💡 Astuce** : Gardez la console ouverte pendant quelques minutes pour vérifier qu'aucune nouvelle erreur n'apparaît lors de l'utilisation normale du site.
