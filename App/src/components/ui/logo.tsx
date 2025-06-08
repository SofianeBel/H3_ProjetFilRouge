import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * Composant Logo de Cyna
 * Utilise le design existant avec les couleurs de la marque
 */
export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <svg 
      className={cn("text-[#6B8DE5]", sizeClasses[size], className)} 
      fill="none" 
      viewBox="0 0 48 48" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Cyna"
    >
      <g clipPath="url(#clip0_cyna_logo)">
        <path 
          clipRule="evenodd" 
          d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" 
          fill="#8E63E5" 
          fillRule="evenodd"
        />
        <path 
          clipRule="evenodd" 
          d="M24 47.2426L12.2426 35.4853H35.7574L24 47.2426Z" 
          fill="#6B8DE5" 
          fillRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_cyna_logo">
          <rect fill="white" height="48" width="48" />
        </clipPath>
      </defs>
    </svg>
  )
} 