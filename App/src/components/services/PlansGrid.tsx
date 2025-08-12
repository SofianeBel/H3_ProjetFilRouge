import Link from 'next/link'

type Plan = {
  id: string
  name: string
  slug: string
  description: string | null
  features: any | null
  price: number
  currency: string
  originalPrice: number | null
  featured: boolean
  popular: boolean
  recommended: boolean
}

export default function PlansGrid({ plans, serviceSlug }: { plans: Plan[]; serviceSlug: string }) {
  if (!plans || plans.length === 0) return null

  const formatAmount = (cents: number, currency = 'eur') =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Tarifs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="bg-[#1A1F28] rounded-xl border border-gray-700 p-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              {p.featured && <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">Mis en avant</span>}
            </div>
            {p.description && <p className="text-gray-400 mb-4">{p.description}</p>}
            <div className="text-2xl font-bold text-white mb-4">{formatAmount(p.price, p.currency)}</div>
            {Array.isArray(p.features) && p.features.length > 0 && (
              <ul className="text-sm text-gray-300 space-y-1 mb-4 list-disc list-inside">
                {p.features.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
            <Link
              href={`/booking?mode=booking&service=${serviceSlug}&plan=${p.slug}`}
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Choisir ce plan
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
