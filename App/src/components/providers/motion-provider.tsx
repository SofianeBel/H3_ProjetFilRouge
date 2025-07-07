"use client";

/**
 * Motion Provider pour configurer Framer Motion globalement
 * Respecte les préférences d'accessibilité et optimise les performances
 */

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig
      // Respecte la préférence utilisateur pour reduced-motion
      reducedMotion="user"
      // Configuration globale pour des transitions fluides
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {children}
    </MotionConfig>
  );
} 