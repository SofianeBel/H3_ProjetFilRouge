"use client";

/**
 * Text Reveal avec animations progressives
 * 
 * Ce composant anime l'apparition du texte de manière progressive,
 * parfait pour les titres et descriptions importantes.
 */

import { motion } from "framer-motion";
import { textRevealVariants, heroTitleVariants } from "@/lib/animation-variants";

interface TextRevealProps {
  children: React.ReactNode;
  variant?: "default" | "hero" | "section";
  className?: string;
  delay?: number;
}

export function TextReveal({
  children,
  variant = "default",
  className,
  delay = 0
}: TextRevealProps) {
  // Je choisis les variants selon le type de texte
  const variants = variant === "hero" ? heroTitleVariants : textRevealVariants;

  // Classes spécifiques selon le variant
  const variantClasses = {
    default: "text-gray-900",
    hero: "text-hero",
    section: "text-section"
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={`${variantClasses[variant]} ${className || ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
} 