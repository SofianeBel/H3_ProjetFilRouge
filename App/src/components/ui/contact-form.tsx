'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

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
}

/**
 * Composant de formulaire de contact
 * Envoie les données vers l'API /api/contact
 */
export function ContactForm({ className, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: undefined,
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
          service: undefined,
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
    <div className={clsx('w-full max-w-md', className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Votre nom"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="votre@email.com"
          />
        </div>

        {/* Entreprise */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Entreprise
          </label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom de votre entreprise"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="06 12 34 56 78"
          />
        </div>

        {/* Service */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                         Service d&apos;intérêt
          </label>
          <select
            id="service"
            value={formData.service || ''}
            onChange={(e) => handleChange('service', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez un service</option>
            <option value="SOC">SOC managé</option>
            <option value="Audit">Audit de sécurité</option>
            <option value="Pentest">Test de pénétration</option>
            <option value="CERT">CERT / Réponse incident</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Décrivez votre besoin..."
          />
        </div>

        {/* Statut de soumission */}
        {submitStatus.type && (
          <div className={clsx(
            'p-3 rounded-md text-sm',
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          )}>
            {submitStatus.message}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            'w-full py-2 px-4 rounded-md font-medium transition-colors',
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          )}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>
      </form>
    </div>
  )
} 