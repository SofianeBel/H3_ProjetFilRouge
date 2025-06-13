'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { MessageSquare } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  service?: 'SOC' | 'Audit' | 'Pentest' | 'CERT' | 'Autre'
  message: string
}

interface ContactFormProps {
  className?: string
  onSuccess?: () => void
  defaultService?: string
}

/**
 * Composant de formulaire de contact simple
 * Envoie les données vers l'API /api/contact
 */
export function ContactForm({ className, onSuccess, defaultService }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: (defaultService as 'SOC' | 'Audit' | 'Pentest' | 'CERT' | 'Autre') || undefined,
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // Gestion des changements dans le formulaire
  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Reset du statut si l'utilisateur recommence à taper
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' })
    }
  }

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Votre demande a été envoyée avec succès'
        })
        // Reset du formulaire
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          service: (defaultService as 'SOC' | 'Audit' | 'Pentest' | 'CERT' | 'Autre') || undefined,
          message: ''
        })
        onSuccess?.()
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Une erreur est survenue'
        })
      }
         } catch {
       setSubmitStatus({
         type: 'error',
         message: 'Erreur de connexion. Veuillez réessayer.'
       })
     }

    setIsSubmitting(false)
  }

  return (
    <div className={clsx('w-full', className)}>
      {/* Messages de statut */}
      {submitStatus.type && (
        <div className={clsx(
          'mb-6 p-4 rounded-lg text-sm',
          submitStatus.type === 'success' 
            ? 'bg-green-500/20 border border-green-500 text-green-400'
            : 'bg-red-500/20 border border-red-500 text-red-400'
        )}>
          {submitStatus.type === 'success' ? '✅' : '❌'} {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">
            Nom complet *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Votre nom et prénom"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="nom@entreprise.com"
          />
        </div>

        {/* Entreprise */}
        <div>
          <label htmlFor="contact-company" className="block text-sm font-medium text-gray-300 mb-2">
            Entreprise
          </label>
          <input
            id="contact-company"
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nom de votre entreprise"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-300 mb-2">
            Téléphone
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+33 1 23 45 67 89"
          />
        </div>

        {/* Service */}
        <div>
          <label htmlFor="contact-service" className="block text-sm font-medium text-gray-300 mb-2">
            Service d&apos;intérêt
          </label>
          <select
            id="service"
            name="service"
            title="Sélection du service"
            value={formData.service || ''}
            onChange={(e) => handleChange('service', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionnez un service (optionnel)</option>
            <option value="SOC">Centre Opérationnel de Sécurité (SOC)</option>
            <option value="Audit">Audit de Sécurité</option>
            <option value="Pentest">Test de Pénétration</option>
            <option value="CERT">Équipe de Réponse aux Incidents (CERT)</option>
            <option value="MSP">Partenariat MSP</option>
            <option value="Formation">Formation Cybersécurité</option>
            <option value="Compliance">Mise en Conformité</option>
            <option value="Incident">Gestion d'Incident</option>
            <option value="Autre">Autre service</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Décrivez votre besoin ou votre question..."
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <MessageSquare className="h-5 w-5" />
              <span>Envoyer ma demande</span>
            </>
          )}
        </button>

        <p className="text-sm text-gray-400 text-center">
          En soumettant ce formulaire, vous acceptez d&apos;être contacté par nos équipes dans les plus brefs délais.
        </p>
      </form>
    </div>
  )
} 