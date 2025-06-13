"use client";

/**
 * Card moderne avec animations hover
 * 
 * Ce composant propose des cartes élégantes avec des effets
 * hover inspirés des sites modernes comme Linear et Supabase.
 */

import { motion } from "framer-motion";
import { cardVariants, serviceCardVariants } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

interface CardModernProps {
  children: React.ReactNode;
  variant?: "default" | "service" | "feature";
  className?: string;
  onClick?: () => void;
  /**
   * Si true, la carte sera cliquable avec un effet de tap
   */
  interactive?: boolean;
  /**
   * Si true, applique un effet hover plus prononcé
   */
  enhanced?: boolean;
}

export function CardModern({
  children,
  variant = "default",
  className,
  onClick,
  interactive = false,
  enhanced = false
}: CardModernProps) {
  // Je choisis les variants selon le type de carte
  const variants = enhanced || variant === "service" ? serviceCardVariants : cardVariants;

  // Classes de base pour toutes les cartes
  const baseClasses = "card-modern";

  // Classes spécifiques selon le variant
  const variantClasses = {
    default: "bg-white border border-gray-200",
    service: "bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60",
    feature: "bg-white border border-gray-200 hover:border-indigo-200"
  };

  // Classes conditionnelles pour l'interactivité
  const interactiveClasses = interactive ? "cursor-pointer card-hover" : "";

  const Component = interactive ? motion.div : motion.div;

  return (
    <Component
      variants={variants}
      initial="initial"
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        interactiveClasses,
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Header de carte avec titre et description
 */
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  );
}

/**
 * Titre de carte avec typographie optimisée
 */
export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-xl font-semibold leading-none tracking-tight text-gray-900", className)}>
      {children}
    </h3>
  );
}

/**
 * Description de carte avec style secondaire
 */
export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-gray-600", className)}>
      {children}
    </p>
  );
}

/**
 * Contenu principal de la carte
 */
export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  );
}

/**
 * Footer de carte pour actions ou informations secondaires
 */
export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)}>
      {children}
    </div>
  );
} 