import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

function parseDate(input?: string | null) {
  if (!input) return null
  const d = new Date(input)
  return isNaN(d.getTime()) ? null : d
}

function toISODate(d: Date) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fillDateRange(from: Date, to: Date) {
  const days: string[] = []
  const cur = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()))
  const end = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()))
  while (cur <= end) {
    days.push(toISODate(cur))
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return days
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
      return NextResponse.json({ success: false, message: 'Accès non autorisé' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'succeeded'
    const toParam = parseDate(searchParams.get('to'))
    const fromParam = parseDate(searchParams.get('from'))

    const to = toParam ?? new Date()
    const from = fromParam ?? new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) // 30 derniers jours

    // SQLite aggregation: daily count, sum, avg
    const rows: { day: string; count: number; amount: number | null; avgAmount: number | null }[] = await prisma.$queryRawUnsafe(
      `SELECT date(createdAt) AS day,
              COUNT(*) AS count,
              SUM(amount) AS amount,
              AVG(amount) AS avgAmount
       FROM orders
       WHERE status = ? AND datetime(createdAt) BETWEEN datetime(?) AND datetime(?)
       GROUP BY date(createdAt)
       ORDER BY date(createdAt) ASC`,
      status,
      from.toISOString(),
      to.toISOString()
    )

    const byDay = new Map<string, { count: number; amount: number; avgAmount: number }>()
    for (const r of rows) {
      byDay.set(r.day, {
        count: Number(r.count || 0),
        amount: Number(r.amount || 0),
        avgAmount: Math.round(Number(r.avgAmount || 0)), // en centimes, arrondi
      })
    }

    const days = fillDateRange(from, to)
    const points = days.map((day) => ({
      day,
      count: byDay.get(day)?.count ?? 0,
      amount: byDay.get(day)?.amount ?? 0,
      avgAmount: byDay.get(day)?.avgAmount ?? 0,
    }))

    const totals = points.reduce(
      (acc, p) => {
        acc.count += p.count
        acc.amount += p.amount
        return acc
      },
      { count: 0, amount: 0 }
    )

    const avgAmountOverall = totals.count > 0 ? Math.round(totals.amount / totals.count) : 0

    return NextResponse.json({
      success: true,
      range: { from: from.toISOString(), to: to.toISOString() },
      currency: 'EUR',
      points,
      totals: { ...totals, avgAmountOverall },
    })
  } catch (error) {
    console.error('Erreur avg-basket:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}
