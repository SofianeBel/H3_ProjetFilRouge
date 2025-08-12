'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ServiceForm, { ServiceFormValues } from '../../ServiceForm'
import { ArrowLeft } from 'lucide-react'

interface ServiceDto {
  id: string
  name: string
  slug: string
  description?: string | null
  longDescription?: string | null
  category?: string | null
  icon?: string | null
  color?: string | null
  purchaseType: 'QUOTE' | 'PRE_CONFIGURED'
  price?: number | null
  currency: string
  published: boolean
  featured: boolean
}

export default function EditServicePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [service, setService] = useState<ServiceDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`/api/admin/services/${params.id}`)
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Erreur chargement')
      setService(json.service as ServiceDto)
    } catch (e: any) {
      setError(e?.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      setSaving(true)
      const res = await fetch(`/api/admin/services/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Erreur sauvegarde')
      router.push('/admin/services')
    } catch (e: any) {
      alert(e?.message || 'Erreur sauvegarde')
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Éditer le service</h1>
          <p className="text-gray-600">Mettre à jour les informations et la visibilité</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/services" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>

        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">Chargement…</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6">{error}</div>
      ) : service ? (
        <div className="">
          <ServiceForm
            defaultValues={{
              name: service.name,
              slug: service.slug,
              description: service.description ?? '',
              longDescription: service.longDescription ?? '',
              category: service.category ?? '',
              icon: service.icon ?? '',
              color: service.color ?? '',
              purchaseType: service.purchaseType,
              price: service.price ?? null,
              currency: service.currency || 'eur',
              published: service.published,
              featured: service.featured,
            }}
            onSubmit={handleSubmit}
            submitLabel={saving ? 'Sauvegarde…' : 'Enregistrer'}
          />
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6">Service introuvable</div>
      )}
    </div>
  )
}