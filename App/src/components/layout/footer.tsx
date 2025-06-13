import Link from "next/link"
import { Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Logo } from "@/components/ui/logo"

/**
 * Footer du site Cyna
 * Contient les liens de navigation, informations de contact et réseaux sociaux
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { name: "SOC 24/7", href: "/services/soc" },
      { name: "Audit de sécurité", href: "/services/audit" },
      { name: "Tests d'intrusion", href: "/services/pentest" },
      { name: "Réponse à incident", href: "/services/cert" },
    ],
    solutions: [
      { name: "PME", href: "/solutions/pme" },
      { name: "MSP", href: "/solutions/msp" },
      { name: "Secteur public", href: "/solutions/public" },
      { name: "Santé", href: "/solutions/sante" },
    ],
    ressources: [
      { name: "Blog", href: "/blog" },
      { name: "Documentation", href: "/docs" },
      { name: "Études de cas", href: "/case-studies" },
      { name: "Webinaires", href: "/webinars" },
    ],
    entreprise: [
      { name: "À propos", href: "/about" },
      { name: "Carrières", href: "/careers" },
    ],
  }

  return (
    <footer className="section-separator bg-[#161A22] py-12">
      <div className="container-cyna">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo et description */}
          <div className="col-span-2 mb-6 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Logo />
              <span className="text-xl font-bold text-white">Cyna</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Pure player en cybersécurité pour PME et MSP. 
              Protection 24/7 par des experts français.
            </p>
            
            {/* Informations de contact */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+33 X XX XX XX XX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@cyna-it.fr</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>France</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Services
            </h3>
            <ul className="space-y-2" role="list">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#A67FFB] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Solutions
            </h3>
            <ul className="space-y-2" role="list">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#A67FFB] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Ressources
            </h3>
            <ul className="space-y-2" role="list">
              {footerLinks.ressources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#A67FFB] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Entreprise
            </h3>
            <ul className="space-y-2" role="list">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#A67FFB] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Séparateur et bas de page */}
        <div className="mt-8 border-t border-[#292e38] pt-8 md:flex md:items-center md:justify-between">
          {/* Réseaux sociaux */}
          <div className="flex space-x-6 md:order-2">
            <Link 
              href="https://twitter.com/cyna_it" 
              className="text-gray-400 hover:text-[#A67FFB] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link 
              href="https://linkedin.com/company/cyna-it" 
              className="text-gray-400 hover:text-[#A67FFB] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>

          {/* Copyright et mentions légales */}
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Cyna. Tous droits réservés.
            </p>
            <div className="mt-2 flex space-x-4 text-xs text-gray-500">
              <Link href="/legal/privacy" className="hover:text-gray-400">
                Politique de confidentialité
              </Link>
              <Link href="/legal/terms" className="hover:text-gray-400">
                Conditions d&apos;utilisation
              </Link>
              <Link href="/legal/cookies" className="hover:text-gray-400">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 