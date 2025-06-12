"use client";

/**
 * Section Container avec animations au scroll
 * 
 * Ce composant détecte quand une section entre dans la viewport
 * et déclenche des animations d'apparition élégantes.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { scrollRevealVariants } from "@/lib/animation-variants";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Si true, déclenche l'animation une seule fois
   * Si false, réanime à chaque fois que la section entre/sort
   */
  once?: boolean;
  /**
   * Marge pour déclencher l'animation avant que l'élément soit complètement visible
   */
  margin?: string;
}

export function SectionContainer({ 
  children, 
  className = "",
  once = true,
  margin = "-100px"
}: SectionContainerProps) {
  const ref = useRef(null);
  
  // Hook useInView pour détecter quand la section est visible
  const isInView = useInView(ref, { 
    once
  });

  return (
    <motion.section
      ref={ref}
      variants={scrollRevealVariants}
      initial="offscreen"
      animate={isInView ? "onscreen" : "offscreen"}
      className={`section-spacing ${className}`}
    >
      {children}
    </motion.section>
  );
} 