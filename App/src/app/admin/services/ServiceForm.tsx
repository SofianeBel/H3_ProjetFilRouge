'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'

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
  } = useForm<z.input<typeof serviceSchema>, any, ServiceFormValues>({
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
  const description = watch('description') || ''
  const longDescription = watch('longDescription') || ''

  const inputClass = (hasError?: boolean) =>
    clsx('mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500', {
      'border-gray-300': !hasError,
      'border-red-400': hasError,
    })

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
      className="rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <div className="divide-y divide-gray-100">
        {/* Section: Informations générales */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                {...register('name')}
                className={inputClass(!!errors.name)}
                placeholder="Ex: SOC managé 24/7"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              <p className="text-xs text-gray-500 mt-1">Nom public affiché sur le site.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                {...register('slug')}
                className={inputClass(!!errors.slug)}
                placeholder="Ex: soc"
                aria-invalid={!!errors.slug}
              />
              {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>}
              <p className="text-xs text-gray-500 mt-1">URL: /services/{slug || '...'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <input
                {...register('category')}
                className={inputClass()}
                placeholder="Ex: soc, audit, pentest, cert"
              />
              <p className="text-xs text-gray-500 mt-1">Utilisé pour le filtrage et la mise en page.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Icône</label>
                <input
                  {...register('icon')}
                  className={inputClass()}
                  placeholder="Ex: Shield"
                />
                <p className="text-xs text-gray-500 mt-1">Nom d'icône Lucide (facultatif).</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Couleur</label>
                <input
                  {...register('color')}
                  className={inputClass()}
                  placeholder="Ex: from-blue-500 to-purple-600"
                />
                <p className="text-xs text-gray-500 mt-1">Gradient Tailwind (facultatif).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Contenu */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Contenu</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              className={inputClass()}
              placeholder="Résumé court du service"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Texte bref affiché dans les listes.</span>
              <span>{description.length} caractères</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description longue</label>
            <textarea
              {...register('longDescription')}
              rows={5}
              className={inputClass()}
              placeholder="Détail complet du service (markdown possible)"
            />
            <div className="flex justify-end text-xs text-gray-500 mt-1">
              <span>{longDescription.length} caractères</span>
            </div>
          </div>
        </div>

        {/* Section: Tarification & visibilité */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Tarification & visibilité</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type d'achat</label>
              <select {...register('purchaseType')} className={inputClass()}>
                <option value="QUOTE">QUOTE</option>
                <option value="PRE_CONFIGURED">PRE_CONFIGURED</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">QUOTE = sur devis, PRE_CONFIGURED = achat direct.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix (centimes)</label>
              <input
                type="number"
                inputMode="numeric"
                {...register('price')}
                className={inputClass(purchaseType === 'PRE_CONFIGURED' && !!errors.price)}
                disabled={purchaseType !== 'PRE_CONFIGURED'}
                placeholder="Ex: 19900"
                aria-invalid={purchaseType === 'PRE_CONFIGURED' && !!errors.price}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Devise</label>
              <input {...register('currency')} className={inputClass()} placeholder="eur" />
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
        </div>

        {/* Actions */}
        <div className="p-6 flex items-center gap-2 bg-gray-50 rounded-b-lg">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
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
