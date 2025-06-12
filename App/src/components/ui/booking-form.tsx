'use client'

import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'

/**
 * Interface pour les données du formulaire de réservation
 */
interface BookingFormData {
  name: string
  email: string
  company: string
  phone: string
  service: string
  preferredDate: string
  message: string
}

/**
 * Props du composant BookingForm
 */
interface BookingFormProps {
  onSuccess?: () => void
  className?: string
}

/**
 * Composant de formulaire de réservation avec créneau horaire
 * Envoie les données vers l'API /api/booking
 */
export function BookingForm({ onSuccess, className }: BookingFormProps) {
  // État du formulaire et de l'interface
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    preferredDate: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * Gestion des changements dans le formulaire
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * Soumission du formulaire de réservation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        // Je remets le formulaire à zéro après succès
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          service: '',
          preferredDate: '',
          message: ''
        })
        onSuccess?.()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Une erreur est survenue')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Erreur de connexion. Veuillez réessayer.')
      console.error('Erreur lors de la soumission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Fonction pour générer la date minimale (aujourd'hui + 1 jour)
   */
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className={className}>
      {/* Messages de statut */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500 text-green-400">
          ✅ Votre demande de réservation a été envoyée avec succès ! Nous vous contacterons rapidement.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-400">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Nom complet */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Votre nom et prénom"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email professionnel *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="nom@entreprise.com"
          />
        </div>

        {/* Entreprise */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
            Entreprise *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nom de votre entreprise"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+33 1 23 45 67 89"
          />
        </div>

        {/* Service sélectionné */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
            Service souhaité *
          </label>
          <select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choisissez un service</option>
            <option value="SOC">Centre Opérationnel de Sécurité (SOC)</option>
            <option value="Audit">Audit de Sécurité</option>
            <option value="Pentest">Test de Pénétration</option>
            <option value="CERT">Équipe de Réponse aux Incidents (CERT)</option>
          </select>
        </div>

        {/* Date préférée */}
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-300 mb-2">
            Date et heure préférées *
          </label>
          <input
            type="datetime-local"
            id="preferredDate"
            name="preferredDate"
            required
            min={getMinDate()}
            value={formData.preferredDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-400 mt-1">
            Horaires recommandés : 9h-17h, du lundi au vendredi
          </p>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Message (optionnel)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Décrivez brièvement vos besoins ou questions..."
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.service}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <Calendar className="h-5 w-5" />
              <span>Réserver ma consultation</span>
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