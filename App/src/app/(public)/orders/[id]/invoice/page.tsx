'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Calendar, CreditCard, MapPin, Truck } from 'lucide-react'

/**
 * Interface pour les données de facture
 */
interface InvoiceData {
  order: {
    id: string
    stripePaymentIntentId: string
    status: string
    currency: string
    createdAt: string
    updatedAt: string
  }
  customer: {
    id: string
    name: string
    email: string
  }
  billingAddress: {
    company?: string
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    postalCode: string
    region?: string
    country: string
    phone?: string
  } | null
  shippingAddress: {
    company?: string
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    postalCode: string
    region?: string
    country: string
    phone?: string
  } | null
  paymentMethod: {
    type: string
    label?: string
    cardLastFour?: string
    cardBrand?: string
  } | null
  items: Array<{
    serviceId: string
    serviceName: string
    serviceSlug: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  financial: {
    subtotalHT: number
    tauxTVA: number
    montantTVA: number
    totalTTC: number
    currency: string
  }
  formattedAmounts: {
    subtotalHT: string
    montantTVA: string
    totalTTC: string
  }
  invoice: {
    number: string
    date: string
    dueDate: string
  }
}

/**
 * Page de facture détaillée
 */
export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = params.id as string

  useEffect(() => {
    if (!orderId) return

    fetchInvoiceData()
  }, [orderId])

  const fetchInvoiceData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/orders/${orderId}/invoice`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login')
          return
        }
        throw new Error(data.message || 'Erreur lors du chargement de la facture')
      }

      setInvoiceData(data.data)
    } catch (err) {
      console.error('Erreur lors du chargement de la facture:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-cyna">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8DE5] mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de la facture...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-cyna">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Facture non trouvée</h1>
            <p className="text-gray-600 mb-6">{error || 'La facture demandée n\'existe pas ou n\'est pas accessible.'}</p>
            <Link
              href="/profile?tab=orders"
              className="inline-flex items-center px-4 py-2 bg-[#6B8DE5] text-white rounded-lg hover:bg-[#5A7BD4] transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-cyna">
        <div className="max-w-4xl mx-auto">
          {/* Actions */}
          <div className="mb-8 print:hidden">
            <div className="flex items-center justify-between">
              <Link
                href="/profile?tab=orders"
                className="inline-flex items-center text-[#6B8DE5] hover:text-[#5A7BD4] font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux commandes
              </Link>
              
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Imprimer / Télécharger
              </button>
            </div>
          </div>

          {/* Facture */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 print:shadow-none print:border-none">
            {/* En-tête de la facture */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">FACTURE</h1>
                <p className="text-lg text-gray-600">N° {invoiceData.invoice.number}</p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-[#6B8DE5] mb-2">CYNA</div>
                <div className="text-sm text-gray-600">
                  <p>Cybersécurité & Audit</p>
                  <p>123 Rue de la Sécurité</p>
                  <p>75001 Paris, France</p>
                  <p>contact@cyna.fr</p>
                </div>
              </div>
            </div>

            {/* Informations facture et client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Informations de facturation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Informations de facturation
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Date de facturation:</span> {new Date(invoiceData.invoice.date).toLocaleDateString('fr-FR')}</p>
                  <p><span className="font-medium">Date d'échéance:</span> {new Date(invoiceData.invoice.dueDate).toLocaleDateString('fr-FR')}</p>
                  <p><span className="font-medium">Statut:</span> 
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Payée
                    </span>
                  </p>
                </div>
              </div>

              {/* Informations client */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturé à</h3>
                {invoiceData.billingAddress ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{invoiceData.billingAddress.firstName} {invoiceData.billingAddress.lastName}</p>
                    {invoiceData.billingAddress.company && <p>{invoiceData.billingAddress.company}</p>}
                    <p>{invoiceData.billingAddress.addressLine1}</p>
                    {invoiceData.billingAddress.addressLine2 && <p>{invoiceData.billingAddress.addressLine2}</p>}
                    <p>{invoiceData.billingAddress.postalCode} {invoiceData.billingAddress.city}</p>
                    {invoiceData.billingAddress.region && <p>{invoiceData.billingAddress.region}</p>}
                    <p>{invoiceData.billingAddress.country}</p>
                    {invoiceData.billingAddress.phone && <p>Tél: {invoiceData.billingAddress.phone}</p>}
                    <p className="mt-2">Email: {invoiceData.customer.email}</p>
                  </div>
                ) : (
                  <div className="text-sm">
                    <p className="font-medium">{invoiceData.customer.name}</p>
                    <p>{invoiceData.customer.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse de livraison si différente */}
            {invoiceData.shippingAddress && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Adresse de livraison
                </h3>
                <div className="text-sm space-y-1 bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{invoiceData.shippingAddress.firstName} {invoiceData.shippingAddress.lastName}</p>
                  {invoiceData.shippingAddress.company && <p>{invoiceData.shippingAddress.company}</p>}
                  <p>{invoiceData.shippingAddress.addressLine1}</p>
                  {invoiceData.shippingAddress.addressLine2 && <p>{invoiceData.shippingAddress.addressLine2}</p>}
                  <p>{invoiceData.shippingAddress.postalCode} {invoiceData.shippingAddress.city}</p>
                  {invoiceData.shippingAddress.region && <p>{invoiceData.shippingAddress.region}</p>}
                  <p>{invoiceData.shippingAddress.country}</p>
                  {invoiceData.shippingAddress.phone && <p>Tél: {invoiceData.shippingAddress.phone}</p>}
                </div>
              </div>
            )}

            {/* Méthode de paiement */}
            {invoiceData.paymentMethod && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Méthode de paiement
                </h3>
                <div className="text-sm bg-gray-50 p-4 rounded-lg">
                  {invoiceData.paymentMethod.type === 'CARD' && invoiceData.paymentMethod.cardBrand && invoiceData.paymentMethod.cardLastFour && (
                    <p>{invoiceData.paymentMethod.cardBrand.toUpperCase()} se terminant par {invoiceData.paymentMethod.cardLastFour}</p>
                  )}
                  {invoiceData.paymentMethod.label && <p>({invoiceData.paymentMethod.label})</p>}
                </div>
              </div>
            )}

            {/* Articles commandés */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détail de la commande</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-semibold text-gray-900">Service</th>
                      <th className="text-center py-3 font-semibold text-gray-900">Quantité</th>
                      <th className="text-right py-3 font-semibold text-gray-900">Prix unitaire HT</th>
                      <th className="text-right py-3 font-semibold text-gray-900">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-900">{item.serviceName}</p>
                            <p className="text-sm text-gray-600">Réf: {item.serviceSlug}</p>
                          </div>
                        </td>
                        <td className="py-4 text-center">{item.quantity}</td>
                        <td className="py-4 text-right">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(item.unitPrice / 100)}
                        </td>
                        <td className="py-4 text-right font-medium">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(item.totalPrice / 100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totaux */}
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total HT</span>
                  <span>{invoiceData.formattedAmounts.subtotalHT}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>TVA ({(invoiceData.financial.tauxTVA * 100).toFixed(0)}%)</span>
                  <span>{invoiceData.formattedAmounts.montantTVA}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total TTC</span>
                    <span>{invoiceData.formattedAmounts.totalTTC}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations légales */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500">
              <p className="mb-2">
                <strong>Conditions de paiement:</strong> Paiement comptant par carte bancaire via Stripe.
              </p>
              <p className="mb-2">
                <strong>TVA:</strong> FR 12 345 678 901 - SIRET: 123 456 789 00010
              </p>
              <p>
                En cas de retard de paiement, des pénalités de 3 fois le taux d'intérêt légal seront appliquées, 
                ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40€.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

