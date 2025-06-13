import { Metadata } from "next"
import Link from "next/link"
import { Briefcase, MapPin, Clock, Award, Users, TrendingUp, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Carrières en cybersécurité | Rejoignez Cyna",
  description: "Rejoignez l'équipe Cyna et participez à la protection des PME françaises. Offres d'emploi, formation, évolution de carrière en cybersécurité.",
}

/**
 * Page carrières - Offres d'emploi et recrutement Cyna
 * Présentation des opportunités de carrière en cybersécurité
 */
export default async function CareersPage() {
  // Récupération des offres d'emploi via l'API
  let jobOffers = []
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/careers`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const { data } = await response.json()
      jobOffers = data
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des offres:', error)
  }

  // Avantages de travailler chez Cyna
  const benefits = [
    {
      icon: TrendingUp,
      title: "Évolution de carrière",
      description: "Plan de carrière personnalisé avec formations et certifications prises en charge."
    },
    {
      icon: Award,
      title: "Formation continue",
      description: "Budget formation de 2000€/an, conférences, certifications techniques."
    },
    {
      icon: Users,
      title: "Équipe passionnée",
      description: "Travaillez avec des experts reconnus dans une ambiance collaborative."
    },
    {
      icon: Heart,
      title: "Mission d'utilité",
      description: "Protégez les PME françaises et participez à la souveraineté numérique."
    },
    {
      icon: MapPin,
      title: "Télétravail hybride",
      description: "Flexibilité avec 2-3 jours de télétravail par semaine selon les postes."
    },
    {
      icon: Briefcase,
      title: "Avantages sociaux",
      description: "Mutuelle d'entreprise, tickets restaurant, participation aux bénéfices."
    }
  ]

  // Processus de recrutement
  const recruitmentProcess = [
    {
      step: "1",
      title: "Candidature",
      description: "Envoyez CV + lettre de motivation via notre formulaire"
    },
    {
      step: "2", 
      title: "Entretien RH",
      description: "Échange téléphonique de 30min avec notre équipe RH"
    },
    {
      step: "3",
      title: "Entretien technique",
      description: "Entretien technique avec le manager et un expert métier"
    },
    {
      step: "4",
      title: "Mise en situation",
      description: "Cas pratique ou étude de cas selon le poste"
    },
    {
      step: "5",
      title: "Décision",
      description: "Retour sous 48h et négociation des conditions"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#A67FFB]/10 rounded-full mb-6">
              <Briefcase className="h-4 w-4 text-[#A67FFB]" />
              <span className="text-sm font-medium text-[#A67FFB]">Carrières</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Construisez votre carrière
              <span className="block text-[#A67FFB]">en cybersécurité</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Rejoignez Cyna et participez à la protection des PME françaises. 
              Évoluez dans un environnement stimulant avec des experts passionnés 
              par la cybersécurité.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Voir nos offres
              </button>
              <button className="btn-secondary">
                Candidature spontanée
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous rejoindre */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Pourquoi rejoindre Cyna ?
            </h2>
            <p className="text-xl text-gray-600">
              Des avantages qui font la différence pour votre épanouissement professionnel
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#A67FFB] rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#161A22] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Offres d'emploi */}
      <section className="py-20 bg-gray-50">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Nos offres d'emploi
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les opportunités disponibles dans notre équipe
            </p>
          </div>
          
          <div className="space-y-8">
            {jobOffers.map((job, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Informations principales */}
                  <div className="lg:col-span-2">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-[#161A22]">
                        {job.title}
                      </h3>
                      <span className="px-3 py-1 bg-[#A67FFB]/10 text-[#A67FFB] rounded-full text-sm font-medium">
                        {job.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {job.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-[#161A22] mb-2">
                          Profil recherché :
                        </h4>
                        <ul className="space-y-1">
                          {JSON.parse(job.requirements || '[]').map((req: any, reqIndex: any) => (
                            <li key={reqIndex} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-[#A67FFB] rounded-full mt-2 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Avantages du poste */}
                  <div className="bg-gradient-to-br from-[#A67FFB]/5 to-purple-50 rounded-xl p-6">
                    <h4 className="font-semibold text-[#161A22] mb-4">
                      Avantages du poste :
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {JSON.parse(job.advantages || '[]').map((advantage: any, advantageIndex: any) => (
                        <li key={advantageIndex} className="text-gray-700 text-sm flex items-center gap-2">
                          <Award className="h-4 w-4 text-[#A67FFB] flex-shrink-0" />
                          {advantage}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-3">
                      <Link 
                        href={`/careers/${job.slug}`}
                        className="block w-full bg-[#A67FFB] text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors text-center"
                      >
                        Voir l'offre détaillée
                      </Link>
                      <button className="w-full bg-white border-2 border-[#A67FFB] text-[#A67FFB] font-semibold py-3 rounded-lg hover:bg-[#A67FFB] hover:text-white transition-colors">
                        Postuler rapidement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus de recrutement */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-4">
              Notre processus de recrutement
            </h2>
            <p className="text-xl text-gray-600">
              Un processus transparent et bienveillant en 5 étapes
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8">
            {recruitmentProcess.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#A67FFB] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-[#161A22] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
                
                {/* Flèche de connexion - sauf pour le dernier */}
                {index < recruitmentProcess.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gray-300 transform translate-x-4">
                    <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-b-2 border-t-transparent border-b-transparent transform -translate-y-1"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignage collaborateur */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-cyna">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#161A22] mb-8">
              Ils ont rejoint l'aventure Cyna
            </h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#A67FFB] to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">TC</span>
                </div>
              </div>
              
              <blockquote className="text-xl text-gray-700 italic mb-6">
                "Rejoindre Cyna a été une excellente décision. L'équipe est passionnée, 
                les projets variés et stimulants. J'évolue techniquement chaque jour 
                tout en ayant un vrai impact sur la sécurité des PME françaises."
              </blockquote>
              
              <div className="text-center">
                <div className="font-semibold text-[#161A22]">Thomas Chen</div>
                <div className="text-gray-600">Analyste SOC Senior</div>
                <div className="text-sm text-gray-500">Chez Cyna depuis 2 ans</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA candidature spontanée */}
      <section className="py-20 bg-[#161A22]">
        <div className="container-cyna text-center">
          <Users className="h-16 w-16 text-[#A67FFB] mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Vous ne trouvez pas le poste idéal ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Envoyez-nous votre candidature spontanée. Nous sommes toujours 
            à la recherche de talents passionnés par la cybersécurité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Candidature spontanée
            </button>
            <button className="btn-secondary">
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 