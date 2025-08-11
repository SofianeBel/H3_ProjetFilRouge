'use client'

import { useRouter } from 'next/navigation'
import ServiceForm, { ServiceFormValues } from '../ServiceForm'

export default function NewServicePage() {
  const router = useRouter()

  const handleSubmit = async (values: ServiceFormValues) => {
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      alert(json.message || 'Erreur à la création')
      return
    }
    router.push('/admin/services')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nouveau service</h1>
        <p className="text-gray-600">Créez une nouvelle offre de service</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ServiceForm defaultValues={{}} onSubmit={handleSubmit} submitLabel="Créer" />
      </div>
    </div>
  )
}
