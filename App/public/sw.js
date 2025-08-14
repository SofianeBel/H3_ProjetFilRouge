/**
 * Service Worker personnalisé pour Cyna
 * Gestion des erreurs chrome-extension et stratégies de cache appropriées
 */

const CACHE_NAME = 'cyna-cache-v1';
const STATIC_CACHE_NAME = 'cyna-static-v1';
const API_CACHE_NAME = 'cyna-api-v1';

// Ressources à mettre en cache automatiquement (URLs sûres)
const STATIC_ASSETS = [
  '/',
  '/favicon.ico'
];

// URLs à ignorer (éviter les erreurs chrome-extension)
const IGNORE_URLS = [
  /^chrome-extension:/,
  /^moz-extension:/,
  /^webkit-extension:/,
  /^safari-extension:/,
  /^edge-extension:/,
  /_next\/static\/chunks\/webpack/,
  /hot-update\.js$/,
  /sockjs-node/
];

/**
 * Vérifie si une URL doit être ignorée (approche defensive)
 */
function shouldIgnoreRequest(request) {
  const url = request.url;
  
  // Vérifications par schéma d'URL
  if (url.startsWith('chrome-extension:') || 
      url.startsWith('moz-extension:') || 
      url.startsWith('webkit-extension:') || 
      url.startsWith('safari-extension:') || 
      url.startsWith('edge-extension:')) {
    return true;
  }
  
  // Vérifications par contenu d'URL
  if (url.includes('hot-update') || 
      url.includes('sockjs-node') || 
      url.includes('webpack') ||
      url.includes('__nextjs_original-stack-frame')) {
    return true;
  }
  
  // Vérifications par type de requête
  if (request.method !== 'GET') {
    return true;
  }
  
  return false;
}

/**
 * Stratégie Network First avec gestion d'erreur renforcée
 */
async function networkFirstStrategy(request) {
  const url = request.url;
  
  // Ignorer complètement les requêtes problématiques
  if (shouldIgnoreRequest(request)) {
    console.warn(`SW: Ignoring problematic request to ${url}`);
    // Faire un fetch normal sans interaction avec le cache
    try {
      return await fetch(request);
    } catch (error) {
      console.warn(`SW: Direct fetch failed for ignored URL:`, error.message);
      throw error;
    }
  }

  try {
    // Tenter la requête réseau en premier
    const response = await fetch(request);
    
    // Vérifier si on peut et doit mettre en cache
    if (response && 
        response.status === 200 && 
        response.type === 'basic' &&
        !shouldIgnoreRequest(request)) {
      
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
        console.log(`SW: Cached ${url}`);
      } catch (cacheError) {
        console.warn(`SW: Failed to cache ${url}:`, cacheError.message);
        // Continuer même si la mise en cache échoue
      }
    }
    
    return response;
  } catch (networkError) {
    console.warn(`SW: Network failed for ${url}, trying cache:`, networkError.message);
    
    // Si le réseau échoue, essayer le cache
    try {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log(`SW: Serving from cache: ${url}`);
        return cachedResponse;
      }
    } catch (cacheError) {
      console.warn(`SW: Cache lookup failed:`, cacheError.message);
    }
    
    // Si rien n'est disponible, retourner une réponse d'erreur appropriée
    if (request.destination === 'document') {
      try {
        return await caches.match('/');
      } catch (error) {
        console.warn(`SW: Failed to serve fallback page:`, error.message);
      }
    }
    
    // Pour les autres ressources, laisser l'erreur se propager
    throw networkError;
  }
}

/**
 * Stratégie Cache First pour les ressources statiques
 */
async function cacheFirstStrategy(request) {
  if (shouldIgnoreRequest(request)) {
    try {
      return await fetch(request);
    } catch (error) {
      console.warn(`SW: Direct fetch failed for ignored static resource:`, error.message);
      throw error;
    }
  }

  try {
    // Vérifier le cache en premier
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log(`SW: Serving static from cache: ${request.url}`);
      return cachedResponse;
    }
    
    // Si pas en cache, aller au réseau
    const response = await fetch(request);
    
    if (response && response.status === 200 && !shouldIgnoreRequest(request)) {
      try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        await cache.put(request, response.clone());
        console.log(`SW: Cached static resource: ${request.url}`);
      } catch (cacheError) {
        console.warn(`SW: Failed to cache static resource:`, cacheError.message);
        // Continuer même si la mise en cache échoue
      }
    }
    
    return response;
  } catch (error) {
    console.error(`SW: Failed to fetch static resource ${request.url}:`, error.message);
    throw error;
  }
}

// Installation du service worker
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        console.log('SW: Precaching static assets');
        
        // Précacher les ressources une par une pour gérer les erreurs individuellement
        const precachePromises = STATIC_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.status === 200) {
              await cache.put(url, response);
              console.log(`SW: Precached ${url}`);
            } else {
              console.warn(`SW: Failed to precache ${url} - status ${response.status}`);
            }
          } catch (error) {
            console.warn(`SW: Failed to precache ${url}:`, error.message);
          }
        });
        
        await Promise.allSettled(precachePromises);
        console.log('SW: Precaching completed');
        
      } catch (error) {
        console.error('SW: Installation failed:', error);
      }
    })()
  );
  
  // Forcer l'activation immédiate
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Prendre le contrôle de tous les clients
      self.clients.claim(),
      
      // Nettoyer les anciens caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![CACHE_NAME, STATIC_CACHE_NAME, API_CACHE_NAME].includes(cacheName)) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // PREMIÈRE LIGNE DE DÉFENSE : Ignorer complètement les requêtes problématiques
  if (shouldIgnoreRequest(request)) {
    console.warn(`SW: Completely ignoring request to ${request.url}`);
    return; // Laisser le navigateur gérer normalement
  }
  
  // DEUXIÈME LIGNE DE DÉFENSE : Wrapper avec try-catch global
  event.respondWith(
    (async () => {
      try {
        // Stratégies différentes selon le type de ressource
        if (request.destination === 'document') {
          // Pages HTML : Network First
          return await networkFirstStrategy(request);
        } else if (request.url.includes('_next/static') || 
                   request.url.includes('.css') || 
                   request.url.includes('.js') ||
                   request.url.includes('.woff') ||
                   request.url.includes('.woff2')) {
          // Ressources statiques : Cache First
          return await cacheFirstStrategy(request);
        } else if (request.url.includes('/api/')) {
          // API : Network First sans cache long terme
          return await networkFirstStrategy(request);
        } else {
          // Autres ressources : Network First
          return await networkFirstStrategy(request);
        }
      } catch (error) {
        console.error(`SW: Fatal error handling request ${request.url}:`, error);
        
        // Fallback ultime : fetch normal
        try {
          return await fetch(request);
        } catch (fetchError) {
          console.error(`SW: Even fallback fetch failed:`, fetchError);
          throw fetchError;
        }
      }
    })()
  );
});

// Gestion des erreurs globales
self.addEventListener('error', event => {
  console.error('SW: Global error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('SW: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

console.log('SW: Service Worker loaded successfully');
