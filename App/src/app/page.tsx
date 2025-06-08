import Link from "next/link"
import { Shield, Eye, AlertTriangle, Users, Clock, CheckCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Section Hero */}
        <section className="gradient-hero relative flex min-h-[calc(100vh-80px)] items-center bg-cover bg-center bg-no-repeat py-20 md:py-32">
          <div className="container-cyna text-center">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-hero text-white">
                Protégez votre entreprise avec {" "}
                <span className="text-[#A67FFB]">Cyna</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl max-w-3xl mx-auto">
                Pure player en cybersécurité pour PME et MSP. 
                                 SOC 24/7, audit de sécurité, pentest et réponse à incident par des experts français.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap">
                <Link href="/booking" className="btn-primary">
                  Réserver une consultation
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Audit gratuit
                </Link>
                <Link 
                  href="/services" 
                  className="group text-base font-semibold leading-6 text-gray-300 transition-colors hover:text-white focus-visible"
                >
                  Nos services 
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 ml-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section Services principaux */}
        <section className="py-16 sm:py-24">
          <div className="container-cyna">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-section-title text-white">
                Nos Services de Cybersécurité
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Une approche complète pour sécuriser votre entreprise contre les cybermenaces.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
              {/* SOC 24/7 */}
              <div className="card-cyna card-hover">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#A67FFB]/10 text-[#A67FFB]">
                  <Eye className="h-7 w-7" />
                </div>
                <h3 className="text-card-title text-white">SOC 24/7</h3>
                <p className="text-gray-400 mt-2">
                  Surveillance continue de votre infrastructure par nos experts. 
                  Détection et réponse aux incidents en temps réel.
                </p>
                <Link 
                  href="/services/soc" 
                  className="mt-4 inline-flex text-[#6B8DE5] hover:text-[#A67FFB] font-medium"
                >
                  En savoir plus →
                </Link>
              </div>

              {/* Audit de sécurité */}
              <div className="card-cyna card-hover">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#A67FFB]/10 text-[#A67FFB]">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-card-title text-white">Audit de Sécurité</h3>
                <p className="text-gray-400 mt-2">
                  Évaluation complète de votre posture de sécurité. 
                  Identification des vulnérabilités et recommandations d'amélioration.
                </p>
                <Link 
                  href="/services/audit" 
                  className="mt-4 inline-flex text-[#6B8DE5] hover:text-[#A67FFB] font-medium"
                >
                  En savoir plus →
                </Link>
              </div>

              {/* Pentest */}
              <div className="card-cyna card-hover">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#A67FFB]/10 text-[#A67FFB]">
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <h3 className="text-card-title text-white">Tests d&apos;Intrusion</h3>
                <p className="text-gray-400 mt-2">
                  Simulations d&apos;attaques pour tester la robustesse de vos défenses. 
                  Pentests applicatifs, réseau et ingénierie sociale.
                </p>
                <Link 
                  href="/services/pentest" 
                  className="mt-4 inline-flex text-[#6B8DE5] hover:text-[#A67FFB] font-medium"
                >
                  En savoir plus →
                </Link>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="/services" className="btn-primary">
                Découvrir tous nos services
              </Link>
            </div>
          </div>
        </section>

        {/* Section Pourquoi Cyna */}
        <section className="bg-[#161A22] py-16 sm:py-24">
          <div className="container-cyna">
            <div className="mx-auto max-w-2xl text-center">
                              <h2 className="text-section-title text-white">
                Pourquoi Choisir Cyna ?
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                L&apos;expertise française au service de votre sécurité numérique.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
              {/* Expertise française */}
              <div className="text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#6B8DE5]/10 text-[#6B8DE5] mx-auto">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-card-title text-white">Expertise Française</h3>
                <p className="mt-2 text-gray-400">
                  Équipe d&apos;experts certifiés basée en France. 
                  Connaissance approfondie du contexte réglementaire local.
                </p>
              </div>

              {/* Réactivité 24/7 */}
              <div className="text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#6B8DE5]/10 text-[#6B8DE5] mx-auto">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-card-title text-white">Réactivité 24/7</h3>
                <p className="mt-2 text-gray-400">
                  Surveillance continue et réponse aux incidents 24h/24, 7j/7. 
                  Temps de réaction garanti selon votre niveau de service.
                </p>
              </div>

              {/* Spécialisé PME/MSP */}
              <div className="text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#6B8DE5]/10 text-[#6B8DE5] mx-auto">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-card-title text-white">Spécialisé PME/MSP</h3>
                <p className="mt-2 text-gray-400">
                  Solutions adaptées aux besoins et budgets des PME et MSP. 
                  Approche pragmatique et orientée résultats.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA finale */}
        <section className="bg-gradient-to-br from-[#6B8DE5] via-[#8E63E5] to-[#A67FFB] py-16 sm:py-24">
          <div className="container-cyna text-center">
            <h2 className="text-section-title text-white">
              Prêt à Sécuriser Votre Entreprise ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Rejoignez les entreprises qui font confiance à Cyna pour leur protection numérique. 
              Audit gratuit et sans engagement.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-8 py-4 text-base font-semibold text-[#111318] shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#8E63E5]"
              >
                Demander un audit gratuit
              </Link>
              <Link
                href="tel:+33XXXXXXXXX"
                className="text-white hover:text-indigo-100 font-semibold"
              >
                Ou appelez-nous directement
              </Link>
            </div>
          </div>
                 </section>
       </main>
       <Footer />
     </>
   )
}
