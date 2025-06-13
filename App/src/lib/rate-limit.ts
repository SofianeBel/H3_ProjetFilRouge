/**
 * Système de rate limiting pour protéger l'authentification
 * Utilise un cache en mémoire simple (à remplacer par Redis en production)
 */

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// Cache en mémoire pour le développement
// En production, utiliser Redis ou une solution persistante
const rateLimitCache = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  maxAttempts: number;      // Nombre max de tentatives
  windowMs: number;         // Fenêtre de temps en millisecondes
  blockDurationMs: number;  // Durée du blocage en millisecondes
}

const defaultConfig: RateLimitConfig = {
  maxAttempts: 5,                    // 5 tentatives max
  windowMs: 15 * 60 * 1000,         // fenêtre de 15 minutes
  blockDurationMs: 30 * 60 * 1000   // blocage 30 minutes
};

/**
 * Vérifie si une adresse IP est rate limitée
 * 
 * @param identifier - IP address ou user ID
 * @param config - Configuration du rate limiting
 * @returns true si bloqué, false si autorisé
 */
export function isRateLimited(
  identifier: string, 
  config: RateLimitConfig = defaultConfig
): boolean {
  const now = Date.now();
  const entry = rateLimitCache.get(identifier);

  // Pas d'entrée existante, on autorise
  if (!entry) {
    return false;
  }

  // Vérifier si encore dans la période de blocage
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return true;
  }

  // Vérifier si la fenêtre de temps est expirée
  if (now - entry.firstAttempt > config.windowMs) {
    // Fenêtre expirée, on reset
    rateLimitCache.delete(identifier);
    return false;
  }

  // Dans la fenêtre et pas encore bloqué
  return entry.attempts >= config.maxAttempts;
}

/**
 * Enregistre une tentative de connexion
 * 
 * @param identifier - IP address ou user ID
 * @param success - true si connexion réussie, false si échec
 * @param config - Configuration du rate limiting
 */
export function recordAttempt(
  identifier: string,
  success: boolean,
  config: RateLimitConfig = defaultConfig
): void {
  const now = Date.now();

  // Si succès, on nettoie l'entrée
  if (success) {
    rateLimitCache.delete(identifier);
    return;
  }

  // Échec de connexion, on incrémente
  const entry = rateLimitCache.get(identifier);

  if (!entry) {
    // Première tentative échouée
    rateLimitCache.set(identifier, {
      attempts: 1,
      firstAttempt: now
    });
  } else {
    // Vérifier si on est dans la même fenêtre
    if (now - entry.firstAttempt <= config.windowMs) {
      entry.attempts++;
      
      // Si on atteint le max, on bloque
      if (entry.attempts >= config.maxAttempts) {
        entry.blockedUntil = now + config.blockDurationMs;
      }
    } else {
      // Nouvelle fenêtre, on reset
      rateLimitCache.set(identifier, {
        attempts: 1,
        firstAttempt: now
      });
    }
  }
}

/**
 * Retourne le temps restant avant déblocage (en secondes)
 */
export function getTimeUntilUnblock(identifier: string): number {
  const entry = rateLimitCache.get(identifier);
  
  if (!entry || !entry.blockedUntil) {
    return 0;
  }

  const timeLeft = entry.blockedUntil - Date.now();
  return Math.max(0, Math.ceil(timeLeft / 1000));
}

/**
 * Nettoie les entrées expirées du cache
 * À appeler périodiquement ou via un cron job
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [identifier, entry] of rateLimitCache.entries()) {
    // Supprimer si la fenêtre est expirée et pas de blocage actif
    const windowExpired = now - entry.firstAttempt > defaultConfig.windowMs;
    const blockExpired = !entry.blockedUntil || now > entry.blockedUntil;
    
    if (windowExpired && blockExpired) {
      rateLimitCache.delete(identifier);
    }
  }
}

/**
 * Obtient l'adresse IP du client depuis la requête
 */
export function getClientIP(request: Request): string {
  // Vérifier les headers de proxy en premier
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback pour développement local
  return '127.0.0.1';
} 