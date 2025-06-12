'use client'

/**
 * Section Services avec design moderne et animations
 * Grid layout responsive avec hover effects et stagger animations
 */

import { motion } from 'framer-motion'
import { 
  Eye, 
  Shield, 
  Search, 
  Lock, 
  Users, 
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { servicesVariants, cardVariants, iconVariants } from '@/lib/motion-config'

// Données des services
const services = [
  {
    id: 'soc',
    icon: Eye,
    title: 'SOC 24/7',
    description: 'Surveillance continue de votre infrastructure avec détection en temps réel des menaces.',
    features: ['Monitoring 24/7', 'Alertes temps réel', 'Analyse comportementale'],
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-50 to-purple-50',
    href: '/services/soc'
  },
  {
    id: 'audit',
    icon: Shield,
    title: 'Audit Sécurité',
    description: 'Évaluation complète de votre posture de sécurité avec recommandations détaillées.',
    features: ['Analyse approfondie', 'Rapport détaillé', 'Plan d\'action'],
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    href: '/services/audit'
  },
  {
    id: 'pentest',
    icon: Search,
    title: 'Tests d\'Intrusion',
    description: 'Tests d\'intrusion éthiques pour identifier les vulnérabilités de vos systèmes.',
    features: ['Tests éthiques', 'Méthodologie OWASP', 'Recommandations'],
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 to-red-50',
    href: '/services/pentest'
  },
  {
    id: 'formation',
    icon: Users,
    title: 'Formation Équipes',
    description: 'Sensibilisation et formation de vos équipes aux bonnes pratiques de cybersécurité.',
    features: ['Modules personnalisés', 'Exercices pratiques', 'Certification'],
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    href: '/services/formation'
  },
  {
    id: 'incident',
    icon: Clock,
    title: 'Réponse Incident',
    description: 'Intervention rapide en cas d\'incident de sécurité avec équipe d\'experts disponible.',
    features: ['Intervention 2h', 'Équipe experte', 'Restauration rapide'],
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50',
    href: '/services/incident'
  },
  {
    id: 'compliance',
    icon: Lock,
    title: 'Conformité',
    description: 'Accompagnement pour la mise en conformité avec les réglementations en vigueur.',
    features: ['GDPR/RGPD', 'ISO 27001', 'Audits conformité'],
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    href: '/services/compliance'
  }
]

interface ServiceCardProps {
  service: typeof services[0]
  index: number
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = service.icon

  return (
    <motion.div
      variants={servicesVariants.item}
      custom={index}
      whileHover="hover"
      initial="initial"
      className="group relative"
    >
      <motion.div
        className={`relative h-full rounded-2xl bg-gradient-to-br ${service.bgGradient} p-8 shadow-sm transition-all duration-300 hover:shadow-xl border border-gray-100 backdrop-blur-sm`}
        variants={cardVariants}
      >
        {/* Icône avec animation */}
        <motion.div
          variants={iconVariants}
          whileHover="hover"
          className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${service.gradient} shadow-lg`}
        >
          <Icon className="h-8 w-8 text-white" />
        </motion.div>

        {/* Titre */}
        <h3 className="mb-4 text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
          {service.title}
        </h3>

        {/* Description */}
        <p className="mb-6 text-gray-600 leading-relaxed">
          {service.description}
        </p>

        {/* Features list */}
        <ul className="mb-8 space-y-2">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-500 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-auto"
        >
          <Link
            href={service.href}
            className={`inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r ${service.gradient} px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            En savoir plus
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Effet de hover subtil */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      </motion.div>
    </motion.div>
  )
}

export function ServicesGrid() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nos Solutions de 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Cybersécurité
            </span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Des services complets pour protéger votre entreprise contre toutes les menaces numériques
          </p>
        </motion.div>

        {/* Grid des services */}
        <motion.div
          variants={servicesVariants.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Besoin d'une solution personnalisée ?
            </h3>
            <p className="text-gray-600 mb-8">
              Nos experts analysent vos besoins spécifiques et conçoivent une stratégie de sécurité adaptée à votre entreprise.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Shield className="mr-2 h-5 w-5" />
                Demander une consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 