'use client'

/**
 * Hero Section moderne avec design Light Mode
 * Inclut gradients subtils, animations Framer Motion et micro-interactions
 */

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Users, Award, Zap } from 'lucide-react'
import Link from 'next/link'
import { heroVariants, floatingVariants, buttonVariants } from '@/lib/motion-config'

export function HeroModern() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/30 overflow-hidden">
      {/* Éléments flottants de background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="float"
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="float"
          style={{ animationDelay: '2s' }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <motion.div
            variants={heroVariants.container}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl"
          >
            {/* Badge de confiance */}
            <motion.div
              variants={heroVariants.cta}
              className="mx-auto mb-8 inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-2 text-sm font-medium text-indigo-700 shadow-sm"
            >
              <Award className="mr-2 h-4 w-4 text-indigo-600" />
              Certifié ISO 27001 • SOC 2 Type II
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              variants={heroVariants.title}
              className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="block">Protégez votre entreprise</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                avec Cyna
              </span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              variants={heroVariants.subtitle}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl"
            >
              Solutions de cybersécurité avancées pour PME et MSP. 
              Surveillance 24/7, audit sécurité, tests d'intrusion et plus encore.
            </motion.p>

            {/* Statistiques rapides */}
            <motion.div
              variants={heroVariants.cta}
              className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-6 sm:gap-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 sm:text-3xl">500+</div>
                <div className="text-sm text-gray-600">Entreprises protégées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 sm:text-3xl">24/7</div>
                <div className="text-sm text-gray-600">Surveillance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600 sm:text-3xl">99.9%</div>
                <div className="text-sm text-gray-600">Disponibilité</div>
              </div>
            </motion.div>

            {/* Boutons CTA */}
            <motion.div
              variants={heroVariants.cta}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Démarrer l'audit gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white/70 backdrop-blur-sm px-8 py-4 text-base font-semibold text-gray-700 transition-all duration-200 hover:border-indigo-300 hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Découvrir nos services
                </Link>
              </motion.div>
            </motion.div>

            {/* Indicateurs de confiance */}
            <motion.div
              variants={heroVariants.cta}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-medium">Déploiement en 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium">Garantie sécurité</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Support expert</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay bottom pour transition fluide */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
    </section>
  )
} 