import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createServiceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  purchaseType: z.enum(['QUOTE', 'PRE_CONFIGURED']).default('QUOTE'),
  price: z.number().int().nonnegative().optional().nullable(),
  currency: z.string().default('eur'),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
      return NextResponse.json({ success: false, message: 'Accès non autorisé' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const published = searchParams.get('published')
    const purchaseType = searchParams.get('purchaseType') || ''
    const orderByParam = searchParams.get('orderBy') || 'createdAt'
    const orderDir = (searchParams.get('order') || 'desc') as 'asc' | 'desc'

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category) where.category = category
    if (purchaseType) where.purchaseType = purchaseType
    if (published === 'true') where.published = true
    if (published === 'false') where.published = false

    const orderBy: any = {}
    orderBy[orderByParam] = orderDir

    const offset = (page - 1) * limit

    const [items, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          plans: { select: { id: true }, where: {} },
        },
      }),
      prisma.service.count({ where }),
    ])

    const itemsWithCounts = items.map((s) => ({
      ...s,
      plansCount: s.plans.length,
    }))

    return NextResponse.json({
      success: true,
      data: {
        items: itemsWithCounts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
    })
  } catch (error) {
    console.error('Erreur GET services:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
      return NextResponse.json({ success: false, message: 'Accès non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createServiceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Validation error', issues: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data

    if (data.purchaseType === 'PRE_CONFIGURED' && (data.price === null || data.price === undefined)) {
      return NextResponse.json({ success: false, message: 'Price required for PRE_CONFIGURED services' }, { status: 400 })
    }

    const exists = await prisma.service.findUnique({ where: { slug: data.slug } })
    if (exists) {
      return NextResponse.json({ success: false, message: 'Slug already exists' }, { status: 409 })
    }

    // Default content fallbacks
    const defaultDescription = data.description ?? `Résumé de ${data.name} – personnalisez ce texte dans l'admin.`
    const defaultLongMd = data.longDescription ?? `# ${data.name}\n\n## Pourquoi choisir ${data.name} ?\n- Avantage 1\n- Avantage 2\n- Avantage 3\n\n## Ce que nous proposons\n- Point A\n- Point B\n\n## Notre approche\n1. Étape 1\n2. Étape 2\n3. Étape 3\n`
    const defaultIcon = data.icon ?? 'Shield'
    const defaultGradient = data.color ?? 'from-blue-500 to-purple-600'

    const service = await prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: defaultDescription,
        longDescription: defaultLongMd,
        category: data.category ?? null,
        icon: defaultIcon,
        color: defaultGradient,
        purchaseType: data.purchaseType as any,
        price: data.price ?? null,
        currency: data.currency || 'eur',
        published: data.published,
        featured: data.featured,
      },
    })

    // Revalidate list and service detail page
    revalidatePath('/services')
    revalidatePath(`/services/${service.slug}`)

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Erreur POST services:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}
