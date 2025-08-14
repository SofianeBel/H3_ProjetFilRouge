'use client';

import { useEffect } from 'react';

/**
 * Provider pour enregistrer et gérer le service worker
 * Résout les problèmes de cache avec les extensions Chrome
 */
export function ServiceWorkerProvider() {
  useEffect(() => {
    // Vérifier si les service workers sont supportés
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      
      // Attendre que la page soit chargée pour éviter les conflits
      window.addEventListener('load', async () => {
        // En développement, ne pas enregistrer de SW et nettoyer d'éventuels caches obsolètes
        if (process.env.NODE_ENV !== 'production') {
          try {
            console.log('🚫 Service Worker désactivé en développement. Nettoyage en cours...');
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(r => r.unregister()));
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
            console.log('🧹 Service workers et caches nettoyés (dev)');
          } catch (error) {
            console.warn('⚠️ Nettoyage SW en développement - avertissement:', error);
          }
          return;
        }
        try {
          console.log('🔧 Enregistrement du service worker...');
          
          // Enregistrer notre service worker personnalisé
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none' // Éviter les problèmes de cache
          });

          console.log('✅ Service worker enregistré avec succès:', registration.scope);

          // Gestion des mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              console.log('🔄 Nouvelle version du service worker détectée');
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('✨ Nouvelle version prête, redémarrage conseillé');
                  
                  // Optionnel : Notifier l'utilisateur qu'une mise à jour est disponible
                  // Vous pouvez ajouter ici une notification toast
                }
              });
            }
          });

          // Écouter les messages du service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('📨 Message du service worker:', event.data);
          });

        } catch (error) {
          // En cas d'erreur, simplement log sans bloquer l'application
          console.warn('⚠️ Impossible d\'enregistrer le service worker:', error);
        }
      });

      // Gestion des erreurs de service worker
      navigator.serviceWorker.addEventListener('error', (error) => {
        console.error('❌ Erreur service worker:', error);
      });

      // Nettoyage si nécessaire
      return () => {
        // Le service worker continue de fonctionner en arrière-plan
        // pas besoin de nettoyage spécifique ici
      };
    } else {
      console.warn('⚠️ Service Workers non supportés dans ce navigateur');
    }
  }, []);

  // Ce composant ne rend rien, il gère juste le service worker
  return null;
}

/**
 * Hook utilitaire pour interagir avec le service worker
 */
export function useServiceWorker() {
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;
  
  const unregister = async () => {
    if (!isSupported) return false;
    
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const results = await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      
      console.log('🗑️ Service workers désactivés');
      return results.every(result => result);
    } catch (error) {
      console.error('❌ Erreur lors de la désinscription:', error);
      return false;
    }
  };

  const refresh = async () => {
    if (!isSupported) return;
    
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.update())
      );
      
      console.log('🔄 Service workers mis à jour');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
    }
  };

  return {
    isSupported,
    unregister,
    refresh
  };
}
