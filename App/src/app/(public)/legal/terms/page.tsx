import { Metadata } from "next"
import { FileText, Scale, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | Cyna",
  description: "Conditions générales d'utilisation des services Cyna. Modalités contractuelles, droits et obligations, responsabilités.",
}

/**
 * Page conditions générales d'utilisation
 * Modalités contractuelles et juridiques des services Cyna
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#161A22] via-[#1a1f28] to-[#1e2329] pt-24 pb-20">
        <div className="container-cyna">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
              <Scale className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Juridique</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Conditions générales
              <span className="block text-[#A67FFB]">d'utilisation</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Modalités contractuelles régissant l'utilisation des services 
              et solutions cybersécurité proposés par Cyna.
            </p>
            
            <div className="text-gray-400 text-sm">
              Dernière mise à jour : 15 décembre 2024
            </div>
          </div>
        </div>
      </section>

      {/* Contenu des CGU */}
      <section className="py-20 bg-white">
        <div className="container-cyna">
          <div className="max-w-4xl mx-auto">
            {/* Avertissement */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-12">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">
                    Information importante
                  </h3>
                  <p className="text-amber-700 text-sm">
                    Ces conditions générales d'utilisation constituent un contrat juridiquement contraignant. 
                    En utilisant nos services, vous acceptez d'être lié par ces conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Article 1 - Objet */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 1 - Objet et champ d'application
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir 
                  les modalités et conditions d'utilisation des services de cybersécurité proposés par la société 
                  Cyna (ci-après "Cyna" ou "nous").
                </p>
                
                <p className="mb-4">
                  Elles s'appliquent à l'ensemble des services fournis par Cyna, notamment :
                </p>
                
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Services SOC (Security Operations Center)</li>
                  <li>Tests d'intrusion et audits de sécurité</li>
                  <li>Services CERT (Computer Emergency Response Team)</li>
                  <li>Consulting et accompagnement cybersécurité</li>
                  <li>Formation et sensibilisation</li>
                </ul>
              </div>
            </section>

            {/* Article 2 - Définitions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 2 - Définitions
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <dl className="space-y-4">
                  <div>
                    <dt className="font-semibold text-[#161A22]">Client :</dt>
                    <dd>Toute personne physique ou morale ayant souscrit aux services de Cyna.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#161A22]">Services :</dt>
                    <dd>L'ensemble des prestations de cybersécurité fournies par Cyna.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#161A22]">Système d'information :</dt>
                    <dd>L'ensemble des ressources informatiques du Client couvertes par les services.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#161A22]">Incident de sécurité :</dt>
                    <dd>Tout événement compromettant ou susceptible de compromettre la sécurité du système d'information.</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Article 3 - Acceptation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 3 - Acceptation des conditions
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  L'utilisation des services de Cyna implique l'acceptation pleine et entière des présentes CGU. 
                  Cette acceptation peut résulter :
                </p>
                
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>De la signature d'un contrat de prestation de services</li>
                  <li>De l'utilisation effective des services</li>
                  <li>De toute autre manifestation de volonté non équivoque</li>
                </ul>
                
                <p>
                  Le Client déclare avoir la capacité juridique nécessaire pour contracter et s'engager 
                  au titre des présentes CGU.
                </p>
              </div>
            </section>

            {/* Article 4 - Services fournis */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 4 - Description des services
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-[#161A22] mb-3">4.1 Services SOC</h3>
                <p className="mb-4">
                  Surveillance 24/7 des systèmes d'information, détection et analyse des menaces, 
                  remontée d'alertes et accompagnement dans la réponse aux incidents.
                </p>
                
                <h3 className="text-lg font-semibold text-[#161A22] mb-3">4.2 Tests d'intrusion</h3>
                <p className="mb-4">
                  Évaluation de la sécurité par simulation d'attaques contrôlées, identification 
                  des vulnérabilités et recommandations de sécurisation.
                </p>
                
                <h3 className="text-lg font-semibold text-[#161A22] mb-3">4.3 Services CERT</h3>
                <p className="mb-4">
                  Réponse aux incidents de sécurité, investigation forensique, containment et 
                  assistance à la remédiation.
                </p>
              </div>
            </section>

            {/* Article 5 - Obligations du client */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 5 - Obligations du Client
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">Le Client s'engage à :</p>
                
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Fournir toutes les informations nécessaires à la réalisation des services</li>
                  <li>Désigner un interlocuteur technique compétent</li>
                  <li>Respecter les recommandations de sécurité émises par Cyna</li>
                  <li>Informer Cyna de tout changement susceptible d'affecter les services</li>
                  <li>Respecter la confidentialité des méthodes et outils utilisés par Cyna</li>
                  <li>S'acquitter des facturations dans les délais convenus</li>
                </ul>
              </div>
            </section>

            {/* Article 6 - Responsabilités */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 6 - Responsabilités et limitations
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-[#161A22] mb-3">6.1 Responsabilité de Cyna</h3>
                <p className="mb-4">
                  Cyna s'engage à fournir ses services avec diligence et selon les règles de l'art. 
                  Sa responsabilité est limitée aux dommages directs prouvés résultant d'une faute 
                  caractérisée dans l'exécution de ses obligations.
                </p>
                
                <h3 className="text-lg font-semibold text-[#161A22] mb-3">6.2 Limitations de responsabilité</h3>
                <p className="mb-4">
                  Cyna ne saurait être tenue responsable :
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Des dommages indirects ou immatériels</li>
                  <li>Des pertes d'exploitation ou de données</li>
                  <li>Des actions de tiers non autorisés</li>
                  <li>De la non-application des recommandations émises</li>
                </ul>
              </div>
            </section>

            {/* Article 7 - Confidentialité */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 7 - Confidentialité
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Cyna s'engage à respecter la confidentialité de toutes les informations 
                  communiquées par le Client dans le cadre de la prestation. Cette obligation 
                  perdure pendant toute la durée contractuelle et 5 ans après son terme.
                </p>
                
                <p className="mb-4">
                  Réciproquement, le Client s'engage à respecter la confidentialité des méthodes, 
                  outils et savoir-faire de Cyna.
                </p>
              </div>
            </section>

            {/* Article 8 - Protection des données */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 8 - Protection des données personnelles
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Le traitement des données personnelles dans le cadre des services est régi 
                  par notre Politique de Confidentialité, conforme au RGPD.
                </p>
                
                <p className="mb-4">
                  Cyna agit en qualité de sous-traitant pour les données personnelles du Client 
                  et s'engage à respecter ses obligations légales en la matière.
                </p>
              </div>
            </section>

            {/* Article 9 - Durée et résiliation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 9 - Durée et résiliation
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Les services sont fournis pour la durée définie dans le contrat de prestation. 
                  En l'absence de durée spécifiée, les services sont fournis jusqu'à résiliation 
                  par l'une des parties avec un préavis de 30 jours.
                </p>
                
                <p className="mb-4">
                  Chaque partie peut résilier immédiatement en cas de manquement grave de l'autre 
                  partie à ses obligations contractuelles.
                </p>
              </div>
            </section>

            {/* Article 10 - Droit applicable */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#161A22] mb-6 border-b border-gray-200 pb-3">
                Article 10 - Droit applicable et litiges
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Les présentes CGU sont soumises au droit français. En cas de litige, 
                  les parties s'efforceront de trouver une solution amiable.
                </p>
                
                <p className="mb-4">
                  À défaut d'accord amiable, tout litige sera porté devant les tribunaux 
                  compétents de Paris.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-xl font-bold text-[#161A22] mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contact juridique
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question relative aux présentes conditions générales, vous pouvez nous contacter :
              </p>
              <div className="text-gray-700">
                <p><strong>Cyna</strong></p>
                <p>123 Avenue de la Cybersécurité</p>
                <p>75001 Paris, France</p>
                <p>Email : juridique@cyna.fr</p>
                <p>Téléphone : +33 (0)1 23 45 67 89</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
} 