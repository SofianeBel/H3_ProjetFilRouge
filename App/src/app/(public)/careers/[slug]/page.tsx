import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, MapPin, Clock, Briefcase, ArrowLeft, Send, Heart } from "lucide-react"
import { Metadata } from "next"

/**
 * Page de détail d'une offre d'emploi
 * Route dynamique basée sur le slug de l'offre
 */
export default async function JobOfferPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  
  // Récupération de l'offre d'emploi via l'API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/careers/${resolvedParams.slug}`, {
    cache: 'no-store' // Pour éviter la mise en cache pendant le développement
  })

  if (!response.ok) {
    notFound()
  }

  const { data } = await response.json()
  const { jobOffer, relatedJobs } = data

  // Parse des données JSON
  const requirements = JSON.parse(jobOffer.requirements || '[]')
  const advantages = JSON.parse(jobOffer.advantages || '[]')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container-cyna py-4">
          <Link 
            href="/careers"
            className="inline-flex items-center text-[#A67FFB] hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux offres
          </Link>
        </div>
      </nav>

      <div className="container-cyna py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header de l'offre */}
          <header className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              {jobOffer.urgent && (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                  🚨 Urgent
                </span>
              )}
              {jobOffer.featured && (
                <span className="px-3 py-1 bg-[#A67FFB]/10 text-[#A67FFB] text-sm font-semibold rounded-full">
                  ⭐ En vedette
                </span>
              )}
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                {jobOffer.type}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-[#161A22] mb-4">
              {jobOffer.title}
            </h1>

            {/* Informations pratiques */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{jobOffer.location}</span>
              </div>
              
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>{jobOffer.department}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{jobOffer.experience}</span>
              </div>
              
              {jobOffer.salary && (
                <div className="flex items-center">
                  <span className="text-green-600 font-semibold">💰 {jobOffer.salary}</span>
                </div>
              )}
              
              {jobOffer.publishedAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Publié le {new Date(jobOffer.publishedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>

            {/* Bouton de candidature */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary inline-flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Postuler maintenant
              </button>
              <button className="btn-secondary inline-flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Sauvegarder
              </button>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2">
              {/* Description du poste */}
              <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-[#161A22] mb-6">
                  Description du poste
                </h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: jobOffer.description.replace(/\n/g, '<br>')
                  }}
                />
              </section>

              {/* Prérequis */}
              <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-[#161A22] mb-6">
                  Prérequis et compétences
                </h2>
                <ul className="space-y-3">
                  {requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-[#A67FFB] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Avantages */}
              <section className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#161A22] mb-6">
                  Ce que nous offrons
                </h2>
                <ul className="space-y-3">
                  {advantages.map((advantage: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Processus de candidature */}
              <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-[#161A22] mb-4">
                  Processus de recrutement
                </h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Candidature", desc: "CV + lettre de motivation" },
                    { step: "2", title: "Entretien RH", desc: "30min en visio" },
                    { step: "3", title: "Entretien technique", desc: "Avec l'équipe" },
                    { step: "4", title: "Cas pratique", desc: "Mise en situation" },
                    { step: "5", title: "Décision", desc: "Retour sous 48h" }
                  ].map((process, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-[#A67FFB] text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        {process.step}
                      </div>
                      <div>
                        <div className="font-semibold text-[#161A22]">{process.title}</div>
                        <div className="text-sm text-gray-600">{process.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contact recrutement */}
              <section className="bg-gradient-to-br from-[#A67FFB]/5 to-purple-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#161A22] mb-4">
                  Questions sur ce poste ?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Notre équipe RH est là pour vous accompagner dans votre candidature.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-[#161A22]">Marie Dubois</div>
                  <div className="text-gray-600">Responsable Recrutement</div>
                  <div className="text-[#A67FFB]">recrutement@cyna-it.fr</div>
                </div>
              </section>
            </div>
          </div>

          {/* Offres similaires */}
          {relatedJobs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold text-[#161A22] mb-8">
                Autres opportunités
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                                 {relatedJobs.map((job: any) => (
                  <Link 
                    key={job.id}
                    href={`/careers/${job.slug}`}
                    className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        {job.type}
                      </span>
                      {job.urgent && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#161A22] mb-2 group-hover:text-[#A67FFB] transition-colors">
                      {job.title}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {job.department}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  
  // Simuler la récupération via API pour la metadata
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/careers/${resolvedParams.slug}`, {
    cache: 'no-store'
  })
  
  const jobOffer = response.ok ? (await response.json()).data.jobOffer : null

  if (!jobOffer) {
    return {
      title: 'Offre non trouvée | Cyna Carrières'
    }
  }

  return {
    title: `${jobOffer.title} | Cyna Carrières`,
    description: jobOffer.metaDescription || `Rejoignez Cyna comme ${jobOffer.title}. ${jobOffer.type} basé à ${jobOffer.location}. Candidature en ligne.`
  }
} 