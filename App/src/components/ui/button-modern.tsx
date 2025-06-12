"use client";

/**
 * Bouton moderne avec micro-interactions Framer Motion
 * 
 * Ce composant propose différents styles de boutons avec
 * des animations fluides inspirées des sites modernes.
 */

import { motion } from "framer-motion";
import { buttonVariants, ctaButtonVariants } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

interface ButtonModernProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "cta" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function ButtonModern({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false,
  type = "button",
}: ButtonModernProps) {
  // Je choisis les variants en fonction du type de bouton
  const variants = variant === "cta" ? ctaButtonVariants : buttonVariants;

  // Classes de base communes à tous les boutons
  const baseClasses = "btn-modern inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  // Classes spécifiques selon le variant
  const variantClasses = {
    primary: "btn-primary text-white",
    secondary: "btn-secondary", 
    cta: "gradient-primary-button text-white animate-gradient",
    ghost: "hover:bg-gray-100 hover:text-gray-900"
  };

  // Classes spécifiques selon la taille
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variants={variants}
      initial="initial"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
} 