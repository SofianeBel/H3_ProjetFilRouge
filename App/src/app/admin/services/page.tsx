'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Edit3, Eye, EyeOff, Plus, Star, Trash2, Search } from 'lucide-react'

interface ServiceItem {
  id: string
  name: string
  slug: string
  description?: string | null
  category?: string | null
  purchaseType: 'QUOTE' | 'PRE_CONFIGURED'
  price?: number | null
  currency: string
  published: boolean
  featured: boolean
  updatedAt: string
  plansCount: number
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [published, setPublished] = useState('') // '', 'true', 'false'
  const [purchaseType, setPurchaseType] = useState('')

  const query = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (published) params.set('published', published)
    if (purchaseType) params.set('purchaseType', purchaseType)
    return params.toString()
  }, [page, limit, search, category, published, purchaseType])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`/api/admin/services?${query}`)
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Erreur chargement')
      setItems(json.data.items)
      setTotalPages(json.data.pagination.totalPages)
    } catch (e: any) {
      setError(e?.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => { load() }, [load])

  const toggle = async (id: string, field: 'published' | 'featured', value: boolean) => {
    const prev = items
    setItems((items) => items.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Erreur MAJ')
    } catch {
      // rollback
      setItems(prev)
      alert('Erreur mise à jour')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Erreur suppression')
      load()
    } catch (e: any) {
      alert(e?.message || 'Erreur suppression')
    }
  }

  const formatAmount = (amount?: number | null, currency = 'eur') => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Gérer vos offres et leur visibilité</p>
        </div>
        <Link href="/admin/services/new" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Nouveau service
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher (nom, slug)" className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border rounded-md">
            <option value="">Catégorie (toutes)</option>
            <option value="audit">Audit</option>
            <option value="soc">SOC</option>
            <option value="pentest">Pentest</option>
            <option value="cert">CERT</option>
          </select>
          <select value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)} className="px-3 py-2 border rounded-md">
            <option value="">Type d'achat</option>
            <option value="QUOTE">QUOTE</option>
            <option value="PRE_CONFIGURED">PRE_CONFIGURED</option>
          </select>
          <select value={published} onChange={(e) => setPublished(e.target.value)} className="px-3 py-2 border rounded-md">
            <option value="">Publication</option>
            <option value="true">Publié</option>
            <option value="false">Non publié</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plans</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publié</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">En avant</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Chargement…</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-red-600">{error}</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Aucun service</td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-500">/{s.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{s.category || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{s.purchaseType}</span>
                    </td>
                    <td className="px-4 py-3">{formatAmount(s.price, s.currency)}</td>
                    <td className="px-4 py-3">{s.plansCount}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(s.id, 'published', !s.published)} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${s.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {s.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} {s.published ? 'Publié' : 'Masqué'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(s.id, 'featured', !s.featured)} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${s.featured ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        <Star className="h-4 w-4" /> {s.featured ? 'Oui' : 'Non'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/services/${s.id}/edit`} className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                          <Edit3 className="h-4 w-4" /> Éditer
                        </Link>
                        <button onClick={() => remove(s.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm bg-red-50 text-red-700 hover:bg-red-100">
                          <Trash2 className="h-4 w-4" /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3 border-t text-sm text-gray-600">
          <div>Page {page} / {totalPages}</div>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Précédent</button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  )
}
