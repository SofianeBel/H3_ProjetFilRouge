import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'

const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  purchaseType: z.enum(['QUOTE', 'PRE_CONFIGURED']).optional(),
  price: z.number().int().nonnegative().optional().nullable(),
  currency: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
      return NextResponse.json({ success: false, message: 'Accès non autorisé' }, { status: 403 })
    }

    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        plans: true,
      },
    })

    if (!service) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Erreur GET service:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
      return NextResponse.json({ success: false, message: 'Accès non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateServiceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Validation error', issues: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data

    if (data.purchaseType === 'PRE_CONFIGURED' && (data.price === null || data.price === undefined)) {
      return NextResponse.json({ success: false, message: 'Price required for PRE_CONFIGURED services' }, { status: 400 })
    }

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...('name' in data ? { name: data.name! } : {}),
        ...('description' in data ? { description: data.description ?? null } : {}),
        ...('longDescription' in data ? { longDescription: data.longDescription ?? null } : {}),
        ...('category' in data ? { category: data.category ?? null } : {}),
        ...('icon' in data ? { icon: data.icon ?? null } : {}),
        ...('color' in data ? { color: data.color ?? null } : {}),
        ...('purchaseType' in data ? { purchaseType: data.purchaseType as any } : {}),
        ...('price' in data ? { price: data.price ?? null } : {}),
        ...('currency' in data ? { currency: data.currency } : {}),
        ...('published' in data ? { published: data.published } : {}),
        ...('featured' in data ? { featured: data.featured } : {}),
      },
    })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Erreur PATCH service:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user.role as string) || '')) {
      return NextResponse.json({ success: false, message: 'Accès non autorisé' }, { status: 403 })
    }

    // Garde simple: refuser la suppression si des plans sont associés
    const plansCount = await prisma.servicePlan.count({ where: { serviceId: params.id } })
    if (plansCount > 0) {
      return NextResponse.json({ success: false, message: 'Cannot delete a service with existing plans' }, { status: 409 })
    }

    await prisma.service.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE service:', error)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}
