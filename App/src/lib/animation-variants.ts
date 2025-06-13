/**
 * Variants d'animation réutilisables pour Framer Motion
 * 
 * Ce fichier contient toutes les animations standardisées
 * utilisées dans l'application pour maintenir la cohérence.
 */

import { Variants } from 'framer-motion'
import { transitions, easings } from './motion-config'

// ===== PAGE TRANSITIONS =====

// Transitions de page inspirées de Next.js + Framer Motion
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smooth
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: transitions.quick
  }
}

// ===== CARDS ANIMATIONS =====

// Cards avec hover effects élégants - Style inspiré de Linear/Supabase
export const cardVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.02)"
  },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 8px 32px rgba(99,102,241,0.12)",
    transition: transitions.quick
  },
  tap: {
    scale: 0.98,
    transition: transitions.quick
  }
}

// Cards service avec animation plus prononcée
export const serviceCardVariants: Variants = {
  initial: {
    scale: 1,
    rotateY: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  hover: {
    scale: 1.03,
    y: -4,
    rotateY: 2,
    boxShadow: "0 8px 25px rgba(0,0,0,0.1), 0 12px 40px rgba(99,102,241,0.15)",
    transition: {
      ...transitions.quick,
      rotateY: { duration: 0.3 }
    }
  }
}

// ===== BUTTON ANIMATIONS =====

// Boutons avec micro-interactions - Style moderne
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
    y: 0
  },
  hover: {
    scale: 1.05,
    y: -1,
    transition: transitions.quick
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: transitions.quick
  }
}

// Boutons CTA avec animation plus marquée
export const ctaButtonVariants: Variants = {
  initial: {
    scale: 1,
    backgroundPosition: "0% 50%"
  },
  hover: {
    scale: 1.06,
    y: -2,
    backgroundPosition: "100% 50%",
    transition: {
      scale: transitions.quick,
      y: transitions.quick,
      backgroundPosition: { duration: 0.6 }
    }
  },
  tap: {
    scale: 0.96,
    transition: transitions.quick
  }
}

// ===== TEXT ANIMATIONS =====

// Animation de révélation de texte progressive
export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    skewY: 3
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: easings.supabase
    }
  })
}

// Animation de titre hero avec effet de gradient
export const heroTitleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easings.cursor,
      delay: 0.2
    }
  }
}

// ===== ICON ANIMATIONS =====

// Icônes avec rotation et scale
export const iconVariants: Variants = {
  initial: {
    scale: 1,
    rotate: 0
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: transitions.quick
  },
  tap: {
    scale: 0.9,
    rotate: -5,
    transition: transitions.quick
  }
}

// Icônes avec animation de pulsation
export const iconPulseVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1
  },
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// ===== CONTAINER ANIMATIONS =====

// Container avec staggered children - Style Linear
export const containerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.3
    }
  }
}

// Container pour grille de services
export const servicesGridVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

// ===== SCROLL ANIMATIONS =====

// Animation basée sur le scroll - Intersection Observer
export const scrollRevealVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  onscreen: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easings.supabase
    }
  }
}

// Animation parallax subtile
export const parallaxVariants: Variants = {
  offscreen: {
    y: 0
  },
  onscreen: {
    y: -50,
    transition: {
      duration: 1.2,
      ease: "easeOut"
    }
  }
}

// ===== NAVIGATION ANIMATIONS =====

// Menu mobile avec slide
export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: transitions.quick
  },
  open: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth
  }
}

// Liens de navigation avec underline
export const navLinkVariants: Variants = {
  initial: {
    color: "var(--color-text-secondary)"
  },
  hover: {
    color: "var(--color-primary-start)",
    transition: transitions.quick
  }
}

// ===== FORM ANIMATIONS =====

// Champs de formulaire avec focus
export const inputVariants: Variants = {
  initial: {
    borderColor: "var(--color-border-light)",
    boxShadow: "0 0 0 0px rgba(99, 102, 241, 0)"
  },
  focus: {
    borderColor: "var(--color-primary-start)",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
    transition: transitions.quick
  },
  error: {
    borderColor: "var(--color-destructive)",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
    transition: transitions.quick
  }
}

// ===== LOADING ANIMATIONS =====

// Animation de chargement avec points
export const loadingDotsVariants: Variants = {
  initial: {
    y: 0
  },
  animate: {
    y: [-2, -8, -2],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Spinner de chargement
export const spinnerVariants: Variants = {
  initial: {
    rotate: 0
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// ===== MODAL ANIMATIONS =====

// Modales avec backdrop blur
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.smooth
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.quick
  }
}

// Backdrop de modal
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: transitions.smooth
  },
  exit: {
    opacity: 0,
    transition: transitions.quick
  }
} 