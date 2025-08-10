'use client'

import { useEffect, useMemo, useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from 'recharts'

interface Item { category: string; count: number; amount: number; percent: number }

function formatEur(cents: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

const COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#dc2626', '#22c55e'
]

function colorForIndex(i: number) {
  return COLORS[i % COLORS.length]
}

export default function AdminCategorySalesPie() {
  const [range, setRange] = useState<'7' | '30' | '90'>('30')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [totals, setTotals] = useState<{ amount: number; count: number }>({ amount: 0, count: 0 })

  const { from, to } = useMemo(() => {
    const to = new Date()
    const days = range === '7' ? 6 : range === '30' ? 29 : 89
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    return { from, to }
  }, [range])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = `/api/admin/orders/by-category?from=${from.toISOString()}&to=${to.toISOString()}&status=succeeded&minPercent=0.03`
        const res = await fetch(url)
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.message || 'Erreur chargement catégories')
        setItems(json.items as Item[])
        setTotals(json.totals)
      } catch (e: any) {
        setError(e?.message || 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [from, to])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Ventes par catégorie</h2>
        <div className="flex gap-2">
          {(['7','30','90'] as const).map((val) => (
            <button
              key={val}
              onClick={() => setRange(val)}
              className={`px-3 py-1.5 text-sm rounded-md border ${range === val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {val} j
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
          <p>Aucune donnée</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500">Revenus</div>
              <div className="text-lg font-semibold">{formatEur(totals.amount)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Commandes</div>
              <div className="text-lg font-semibold">{totals.count}</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items.map((it) => ({ name: it.category, value: it.amount, percent: it.percent, count: it.count }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  label={(entry: any) => (entry.percent >= 0.05 ? `${Math.round(entry.percent * 100)}%` : '')}
                >
                  {items.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={colorForIndex(i)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: string, p: any) => [formatEur(value as number), name]}
                  labelFormatter={() => ''}
                />
                <Legend verticalAlign="bottom" height={24} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
