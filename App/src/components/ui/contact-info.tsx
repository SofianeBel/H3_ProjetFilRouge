/**
 * Composant d'affichage des informations de contact
 * Réutilisable pour différentes pages
 */
export function ContactInfo() {
  return (
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
  )
} 