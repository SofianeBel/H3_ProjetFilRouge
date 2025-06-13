'use client'

/**
 * Section About moderne avec statistiques animées
 * Inclut métriques clés, timeline et valeurs de l'entreprise
 */

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { 
  Shield, 
  Clock, 
  Users, 
  Award,
  CheckCircle,
  Star,
  TrendingUp,
  Globe
} from 'lucide-react'
import { statsVariants, scrollVariants } from '@/lib/motion-config'

// Données des statistiques
const stats = [
  {
    value: 500,
    suffix: '+',
    label: 'Entreprises protégées',
    description: 'PME et MSP nous font confiance',
    icon: Users,
    color: 'text-indigo-600'
  },
  {
    value: 99.9,
    suffix: '%',
    label: 'Disponibilité',
    description: 'Service SOC haute disponibilité',
    icon: Clock,
    color: 'text-emerald-600'
  },
  {
    value: 2,
    suffix: 'h',
    label: 'Temps de réponse',
    description: 'Intervention en cas d\'incident',
    icon: Shield,
    color: 'text-purple-600'
  },
  {
    value: 15,
    suffix: '+',
    label: 'Années d\'expérience',
    description: 'Expertise en cybersécurité',
    icon: Award,
    color: 'text-orange-600'
  }
]

// Points forts de l'entreprise
const highlights = [
  {
    title: 'Expertise reconnue',
    description: 'Équipe d\'experts certifiés avec 15+ années d\'expérience en cybersécurité',
    icon: Award
  },
  {
    title: 'Conformité garantie',
    description: 'Accompagnement complet pour la mise en conformité GDPR, ISO 27001',
    icon: CheckCircle
  },
  {
    title: 'Innovation continue',
    description: 'Veille technologique et adaptation aux nouvelles menaces cyber',
    icon: TrendingUp
  },
  {
    title: 'Support 24/7',
    description: 'Équipe disponible en permanence pour répondre à vos urgences',
    icon: Globe
  }
]

// Hook pour animer les compteurs
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let startTime: number
      const startValue = 0

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const currentCount = startValue + (end - startValue) * easeOutCubic
        
        setCount(currentCount)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [inView, end, duration])

  return { count, ref }
}

// Composant pour une statistique animée
function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  const { count, ref } = useCounter(stat.value)
  const Icon = stat.icon

  return (
    <motion.div
      ref={ref}
      variants={statsVariants.item}
      custom={index}
      className="relative group"
    >
      <div className="relative h-full rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-sm transition-all duration-300 hover:shadow-lg border border-gray-100">
        {/* Icône */}
        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 ${stat.color}`}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Valeur animée */}
        <div className="mb-2">
          <span className={`text-3xl font-bold ${stat.color}`}>
            {stat.value % 1 === 0 ? Math.round(count) : count.toFixed(1)}
            {stat.suffix}
          </span>
        </div>

        {/* Label et description */}
        <h4 className="font-semibold text-gray-900 mb-1">{stat.label}</h4>
        <p className="text-sm text-gray-600">{stat.description}</p>

        {/* Effet de hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50/0 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      </div>
    </motion.div>
  )
}

// Composant pour un point fort
function HighlightCard({ highlight, index }: { highlight: typeof highlights[0], index: number }) {
  const Icon = highlight.icon

  return (
    <motion.div
      variants={scrollVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.2 }}
      className="relative group"
    >
      <div className="flex items-start space-x-4 p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 transition-all duration-300 hover:bg-white/80 hover:shadow-sm">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm">
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{highlight.title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function AboutSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pourquoi choisir 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Cyna ?
            </span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Une expertise reconnue et des résultats mesurables pour protéger votre entreprise
          </p>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          variants={statsVariants.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20"
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Contenu principal */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Texte principal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Votre partenaire de confiance en cybersécurité
            </h3>
            <div className="prose prose-lg text-gray-600 mb-8">
              <p>
                Depuis plus de 15 ans, <strong>Cyna</strong> accompagne les PME et MSP dans leur transformation numérique sécurisée. 
                Notre mission est de démocratiser l'accès aux technologies de cybersécurité de niveau entreprise.
              </p>
              <p>
                Nous combinons expertise technique, innovation et approche humaine pour offrir des solutions 
                adaptées à vos enjeux métier et à votre budget.
              </p>
            </div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">4.9/5 (248 avis)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4 text-indigo-600" />
                <span>Certifié ISO 27001</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Points forts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {highlights.map((highlight, index) => (
              <HighlightCard key={highlight.title} highlight={highlight} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 