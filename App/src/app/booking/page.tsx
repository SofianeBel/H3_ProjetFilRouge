/**
 * Page de réservation de rendez-vous
 * Permet aux clients de prendre RDV pour audits, conseils SOC, pentests, etc.
 */

'use client'

import { useState } from 'react'
import { Calendar, Clock, Shield, Search, FileText, Users } from 'lucide-react'

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
 * Types de services disponibles avec leurs descriptions
 */
const services = [
  {
    id: 'SOC',
    name: 'Centre Opérationnel de Sécurité (SOC)',
    description: 'Surveillance et détection proactive des menaces',
    icon: Shield,
    duration: '45 min',
    price: 'Gratuit'
  },
  {
    id: 'Audit',
    name: 'Audit de Sécurité',
    description: 'Évaluation complète de votre infrastructure',
    icon: Search,
    duration: '60 min',
    price: 'Gratuit'
  },
  {
    id: 'Pentest',
    name: 'Test de Pénétration',
    description: 'Simulation d\'attaques pour tester vos défenses',
    icon: FileText,
    duration: '60 min',
    price: 'Gratuit'
  },
  {
    id: 'CERT',
    name: 'Équipe de Réponse aux Incidents (CERT)',
    description: 'Consultation sur la gestion d\'incidents de sécurité',
    icon: Users,
    duration: '30 min',
    price: 'Gratuit'
  }
]

export default function BookingPage() {
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
   * Fonction pour généer la date minimale (aujourd'hui + 1 jour)
   */
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header avec titre principal */}
      <div className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Calendar className="mx-auto h-16 w-16 text-blue-400" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Réservez Votre <span className="text-blue-400">Consultation</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Planifiez un entretien gratuit avec nos experts en cybersécurité pour discuter de vos besoins spécifiques.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Section des services disponibles */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Nos Services de Consultation</h2>
            <div className="space-y-6">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    formData.service === service.id 
                      ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, service: service.id }))}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      formData.service === service.id ? 'bg-blue-500' : 'bg-gray-700'
                    }`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{service.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration}
                        </span>
                        <span className="text-green-400 font-medium">{service.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div>
            <div className="rounded-2xl bg-gray-800/70 backdrop-blur-sm border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Formulaire de Réservation</h2>
              
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
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
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
          </div>
        </div>
      </div>
    </div>
  )
} 