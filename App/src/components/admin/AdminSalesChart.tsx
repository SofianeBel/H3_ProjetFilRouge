'use client'

import { useEffect, useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

type Point = { day: string; count: number; amount: number }

function formatDateLabel(isoDay: string) {
  // isoDay = YYYY-MM-DD
  const [y, m, d] = isoDay.split('-').map(Number)
  const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1))
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

function formatEur(cents: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export default function AdminSalesChart() {
  const [range, setRange] = useState<'7' | '30' | '90'>('30')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Point[]>([])
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
        const url = `/api/admin/orders/stats?from=${from.toISOString()}&to=${to.toISOString()}&status=succeeded`
        const res = await fetch(url)
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.message || 'Erreur chargement stats')
        setData(json.points as Point[])
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
        <h2 className="text-lg font-medium text-gray-900">Ventes par jour</h2>
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
      ) : data.length === 0 ? (
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
              <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickFormatter={formatDateLabel} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => formatEur(v)} tick={{ fontSize: 12 }} width={70} />
                <Tooltip
                  formatter={(value: any, name: string) =>
                    name === 'amount' ? [formatEur(value as number), 'Revenus'] : [String(value), 'Commandes']
                  }
                  labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                />
                <Bar dataKey="amount" name="Revenus" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
