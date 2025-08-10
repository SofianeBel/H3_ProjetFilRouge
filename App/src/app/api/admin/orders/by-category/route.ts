import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

function parseDate(input?: string | null) {
  if (!input) return null
  const d = new Date(input)
  return isNaN(d.getTime()) ? null : d
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
    const minPercentParam = Number(searchParams.get('minPercent') || '0.03') // 3% par défaut

    const to = toParam ?? new Date()
    const from = fromParam ?? new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)

    // Agrégation SQLite par metadata.category
    const rows: { category: string | null; count: number; amount: number | null }[] = await prisma.$queryRawUnsafe(
      `SELECT COALESCE(json_extract(metadata, '$.category'), 'Unknown') AS category,
              COUNT(*) AS count,
              SUM(amount) AS amount
       FROM orders
       WHERE status = ? AND datetime(createdAt) BETWEEN datetime(?) AND datetime(?)
       GROUP BY COALESCE(json_extract(metadata, '$.category'), 'Unknown')
       ORDER BY amount DESC`,
      status,
      from.toISOString(),
      to.toISOString()
    )

    const items = rows.map((r) => ({
      category: (r.category ?? 'Unknown') as string,
      count: Number(r.count || 0),
      amount: Number(r.amount || 0),
    }))

    const totals = items.reduce(
      (acc, it) => {
        acc.count += it.count
        acc.amount += it.amount
        return acc
      },
      { count: 0, amount: 0 }
    )

    // Calcul des pourcentages et regroupement des petites parts
    const withPercent = items.map((it) => ({
      ...it,
      percent: totals.amount > 0 ? it.amount / totals.amount : 0,
    }))

    // Regrouper en "Other" les catégories sous le seuil
    const small = withPercent.filter((it) => it.percent < minPercentParam)
    const large = withPercent.filter((it) => it.percent >= minPercentParam)

    const other = small.reduce(
      (acc, it) => {
        acc.count += it.count
        acc.amount += it.amount
        return acc
      },
      { category: 'Other', count: 0, amount: 0, percent: 0 }
    )

    const finalItems = [...large, ...(other.amount > 0 ? [
      { ...other, percent: totals.amount > 0 ? other.amount / totals.amount : 0 },
    ] : [])]
      .sort((a, b) => b.amount - a.amount)

    return NextResponse.json({
      success: true,
      range: { from: from.toISOString(), to: to.toISOString() },
      currency: 'EUR',
      items: finalItems,
      totals,
    })
  } catch (error) {
    console.error('Erreur by-category:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}
