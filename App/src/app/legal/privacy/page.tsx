import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Cyna",
  description: "Découvrez comment Cyna protège vos données personnelles avec transparence et rigueur.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#111318] text-white px-6 py-12 max-w-4xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-[#6B8DE5] mb-6">
        Politique de Confidentialité
      </h1>

      <p className="text-gray-300">
        Cette politique de confidentialité décrit comment Cyna collecte, utilise, protège et partage les informations personnelles de ses utilisateurs, conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">1. Données collectées</h2>
        <p className="text-gray-300">Nous collectons des informations personnelles telles que votre nom, adresse e-mail, informations de facturation et adresse IP. Ces données sont essentielles à la gestion de votre compte et à l'amélioration de nos services.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">2. Finalité de la collecte</h2>
        <p className="text-gray-300">Les données collectées permettent la gestion des commandes, l’envoi de notifications importantes, l’assistance client, et la sécurité de la plateforme.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">3. Conservation des données</h2>
        <p className="text-gray-300">Vos données sont conservées pour la durée nécessaire à l’accomplissement des objectifs mentionnés ci-dessus, sauf disposition contraire de la loi.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">4. Partage des données</h2>
        <p className="text-gray-300">Cyna ne partage jamais vos données avec des tiers sans votre consentement, sauf dans les cas où cela est exigé par la loi ou nécessaire à l’exécution des services contractuels.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">5. Vos droits</h2>
        <p className="text-gray-300">Conformément au RGPD, vous avez le droit d’accéder, de rectifier, de supprimer ou de limiter l’usage de vos données. Vous pouvez également demander une copie de vos données dans un format structuré.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">6. Cookies</h2>
        <p className="text-gray-300">Des cookies sont utilisés pour améliorer votre navigation, mesurer l’audience, et personnaliser le contenu. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">7. Sécurité</h2>
        <p className="text-gray-300">Cyna applique des mesures de sécurité robustes, incluant le chiffrement des données, l’accès restreint, et des audits réguliers, afin de garantir la confidentialité et l’intégrité des données.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">8. Contact</h2>
        <p className="text-gray-300">Pour toute question concernant cette politique ou pour exercer vos droits, veuillez nous contacter à l’adresse suivante : privacy@cyna-it.fr</p>
      </section>

      <p className="text-sm text-gray-500 pt-10">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>
    </main>
  );
}
