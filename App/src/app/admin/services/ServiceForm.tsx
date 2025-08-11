'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const serviceSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide'),
  description: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  purchaseType: z.enum(['QUOTE', 'PRE_CONFIGURED']),
  price: z
    .preprocess((v) => (v === '' || v === null || v === undefined ? null : Number(v)), z.number().int().nonnegative().nullable())
    .optional(),
  currency: z.string().default('eur'),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>

export default function ServiceForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Enregistrer',
}: {
  defaultValues: Partial<ServiceFormValues>
  onSubmit: (values: ServiceFormValues) => Promise<void>
  submitLabel?: string
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      slug: '',
      purchaseType: 'QUOTE',
      currency: 'eur',
      published: true,
      featured: false,
      ...defaultValues,
      // normalize nullable fields
      description: defaultValues.description ?? '',
      longDescription: defaultValues.longDescription ?? '',
      category: defaultValues.category ?? '',
      icon: defaultValues.icon ?? '',
      color: defaultValues.color ?? '',
    },
  })

  const name = watch('name')
  const slug = watch('slug')
  // Auto-generate slug from name if slug empty or matches previous derived
  useEffect(() => {
    if (!name) return
    if (!slug || slug === deriveSlug(defaultValues.name || '')) {
      setValue('slug', deriveSlug(name), { shouldValidate: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  const purchaseType = watch('purchaseType')

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        // Ensure price is present for PRE_CONFIGURED
        if (values.purchaseType === 'PRE_CONFIGURED' && (values.price === null || values.price === undefined)) {
          alert('Le prix est requis pour les services PRE_CONFIGURED')
          return
        }
        await onSubmit(values)
      })}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input {...register('name')} className="mt-1 w-full px-3 py-2 border rounded-md" />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input {...register('slug')} className="mt-1 w-full px-3 py-2 border rounded-md" />
          {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
          <input {...register('category')} className="mt-1 w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Icône</label>
            <input {...register('icon')} className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Couleur</label>
            <input {...register('color')} className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description')} rows={2} className="mt-1 w-full px-3 py-2 border rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description longue</label>
        <textarea {...register('longDescription')} rows={4} className="mt-1 w-full px-3 py-2 border rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type d'achat</label>
          <select {...register('purchaseType')} className="mt-1 w-full px-3 py-2 border rounded-md">
            <option value="QUOTE">QUOTE</option>
            <option value="PRE_CONFIGURED">PRE_CONFIGURED</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prix (centimes)</label>
          <input type="number" inputMode="numeric" {...register('price')} className="mt-1 w-full px-3 py-2 border rounded-md" disabled={purchaseType !== 'PRE_CONFIGURED'} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Devise</label>
          <input {...register('currency')} className="mt-1 w-full px-3 py-2 border rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('published')} /> Publié
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('featured')} /> En avant
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function deriveSlug(input: string) {
  return (input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
