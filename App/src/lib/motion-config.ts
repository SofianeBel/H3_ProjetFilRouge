/**
 * Configuration globale pour Framer Motion
 * 
 * Ce fichier centralise toutes les configurations d'animation
 * pour assurer une cohérence dans toute l'application.
 */

import { Variants, Transition } from 'framer-motion'

/**
 * Configuration globale pour les animations Framer Motion
 * Contient tous les variants réutilisables pour le design moderne
 */

export const motionConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
}

// Variants pour les transitions de page
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
}

// Variants pour le hero section
export const heroVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  },
  title: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  },
  subtitle: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2
      }
    }
  },
  cta: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.4
      }
    }
  }
}

// Variants pour les cards avec hover effects
export const cardVariants = {
  initial: { 
    scale: 1, 
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    rotateY: 0
  },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 12px 24px rgba(99,102,241,0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

// Variants pour les services grid avec stagger
export const servicesVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }
}

// Variants pour les buttons avec micro-interactions
export const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  loading: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Variants pour les animations de texte reveal
export const textRevealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

// Variants pour les icônes avec animations
export const iconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1, 
    rotate: 5,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: { scale: 0.9 }
}

// Variants pour les scroll-based animations
export const scrollVariants = {
  offscreen: { 
    y: 100, 
    opacity: 0,
    scale: 0.95
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
}

// Variants pour les stats animées
export const statsVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  },
  item: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }
}

// Variants pour les éléments flottants
export const floatingVariants = {
  float: {
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Transitions personnalisées pour différents cas d'usage
export const transitions = {
  // Transition douce pour les éléments standard
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] // cubic-bezier équivalent à ease-out CSS
  } as Transition,
  
  // Transition rapide pour les micro-interactions
  quick: {
    duration: 0.15,
    ease: "easeOut"
  } as Transition,
  
  // Transition avec rebond pour les éléments ludiques
  bouncy: {
    type: "spring",
    stiffness: 500,
    damping: 30
  } as Transition,
  
  // Transition lente pour les grands éléments
  slow: {
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1]
  } as Transition,
  
  // Transition pour les layouts qui changent
  layout: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1]
  } as Transition
}

// Easings personnalisés inspirés des sites références
export const easings = {
  // Easing de Cursor.sh - Animation très fluide
  cursor: [0.25, 0.46, 0.45, 0.94],
  
  // Easing de Linear.app - Animation précise
  linear: [0.4, 0, 0.2, 1],
  
  // Easing de Supabase - Animation naturelle
  supabase: [0.16, 1, 0.3, 1],
  
  // Easing de Vercel - Animation minimaliste
  vercel: [0.4, 0, 0.6, 1],
  
  // Easing de Ramp - Animation sophistiquée
  ramp: [0.645, 0.045, 0.355, 1]
}

// Configuration globale pour reduced-motion
export const motionGlobalConfig = {
  // Respecte les préférences utilisateur pour reduced-motion
  reducedMotion: "user" as const,
  
  // Transition par défaut pour tous les composants motion
  transition: transitions.smooth
} 