import { prisma } from '@/lib/prisma'
//import Link from 'next/link'
import { notFound } from 'next/navigation'
//import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import ServiceHero from '@/components/services/ServiceHero'
import ServiceMarkdown from '@/components/services/ServiceMarkdown'
import PlansGrid from '@/components/services/PlansGrid'
import ContactCTA from '@/components/services/ContactCTA'

export const revalidate = 60

type PageParams = { params: { slug: string } }

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true, published: true },
  })
  if (!service || !service.published) {
    return { title: 'Service introuvable' }
  }
  return {
    title: `${service.name} | Cyna`,
    description: service.description || undefined,
  }
}

export default async function ServicePage({ params }: PageParams) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
    include: {
      plans: { where: { published: true }, orderBy: { price: 'asc' } },
    },
  })

  if (!service || !service.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#111318]">
      <ServiceHero
        name={service.name}
        description={service.description || ''}
        iconName={service.icon || undefined}
        gradient={service.color || undefined}
      />

      <section className="py-16">
        <div className="container-cyna">
          {service.longDescription && (
            <div className="bg-[#1A1F28] rounded-2xl p-8 border border-gray-700 mb-12">
              <ServiceMarkdown markdown={service.longDescription} />
            </div>
          )}

          <PlansGrid plans={service.plans} serviceSlug={service.slug} />
        </div>
      </section>

      <ContactCTA />
    </div>
  )
}
