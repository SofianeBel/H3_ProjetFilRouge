"use client";

/**
 * Template global pour les transitions de page avec Framer Motion
 * 
 * Ce composant utilise le système de template de Next.js pour créer
 * une nouvelle instance à chaque navigation, permettant les animations
 * d'entrée et de sortie entre les pages.
 * 
 * Contrairement à layout.tsx, template.tsx recrée ses enfants à chaque
 * navigation, ce qui est parfait pour les animations de page.
 */

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animation-variants";

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return (
    <motion.div
      // On utilise les variants prédéfinis pour la cohérence
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      // Classes pour maintenir le layout pendant l'animation
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
} 