"use client";

/**
 * Page Wrapper avec animations Framer Motion
 * 
 * Ce composant enveloppe le contenu des pages pour ajouter
 * des animations d'entrée et de sortie fluides.
 */

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animation-variants";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
} 