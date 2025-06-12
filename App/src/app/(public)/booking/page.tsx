/**
 * Page unifiée de contact et réservation
 * Permet aux visiteurs de nous contacter ou de réserver un créneau
 */

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar, MessageSquare, Shield, Search, FileText, Users, Clock } from 'lucide-react'
import { ContactForm } from '@/components/ui/contact-form'
import { BookingForm } from '@/components/ui/booking-form'

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

export default function UnifiedContactPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'message' | 'booking'>('booking')

  // Je récupère le mode depuis l'URL (pour la redirection depuis /contact)
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'message') {
      setActiveTab('message')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header avec titre principal */}
      <div className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center mb-6">
              {activeTab === 'booking' ? (
                <Calendar className="h-16 w-16 text-blue-400" />
              ) : (
                <MessageSquare className="h-16 w-16 text-blue-400" />
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {activeTab === 'booking' ? (
                <>Réservez Votre <span className="text-blue-400">Consultation</span></>
              ) : (
                <>Contactez <span className="text-blue-400">Nos Experts</span></>
              )}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {activeTab === 'booking' 
                ? 'Planifiez un entretien gratuit avec nos experts en cybersécurité pour discuter de vos besoins spécifiques.'
                : 'Parlons de vos besoins en cybersécurité. Notre équipe d\'experts est là pour vous accompagner.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        {/* Onglets de navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('message')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'message'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Envoyer un message</span>
              </button>
              <button
                onClick={() => setActiveTab('booking')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'booking'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Réserver un créneau</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Section principale - formulaire */}
          <div>
            {activeTab === 'booking' && (
              <>
                {/* Section des services disponibles pour booking */}
                <h2 className="text-2xl font-bold text-white mb-8">Nos Services de Consultation</h2>
                <div className="space-y-6 mb-12">
                  {services.map((service) => (
                    <div 
                      key={service.id}
                      className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 hover:border-gray-600 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-gray-700">
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
              </>
            )}

            {/* Formulaire principal */}
            <div className="rounded-2xl bg-gray-800/70 backdrop-blur-sm border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {activeTab === 'booking' ? 'Formulaire de Réservation' : 'Envoyez-nous un message'}
              </h2>
              
              {activeTab === 'booking' ? (
                <BookingForm />
              ) : (
                <ContactForm className="w-full max-w-none" />
              )}
            </div>
          </div>

          {/* Section informations de contact */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Nos coordonnées
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@cyna-it.fr</p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Téléphone</h3>
                    <p className="text-gray-600">+33 (0)1 23 45 67 89</p>
                  </div>
                </div>

                {/* Horaires */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Horaires</h3>
                    <p className="text-gray-600">
                      Lundi - Vendredi : 9h00 - 18h00<br />
                      Urgences 24h/7j pour nos clients SOC
                    </p>
                  </div>
                </div>

                {/* Services */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Nos services</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-blue-900">SOC managé</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-blue-900">Audit sécurité</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-blue-900">Pentest</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-blue-900">CERT</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action urgence */}
            <div className="mt-8">
              <div className="bg-blue-600 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Besoin d&apos;une réponse rapide ?
                </h3>
                <p className="text-blue-100 mb-6">
                  Pour les urgences sécurité, contactez directement notre équipe CERT
                </p>
                <a 
                  href="tel:+33123456789"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler maintenant
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 