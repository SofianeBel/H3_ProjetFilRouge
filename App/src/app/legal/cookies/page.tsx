export const metadata = {
  title: "Politique de Cookies – Cyna",
  description: "Utilisation des cookies sur notre site Cyna.",
};

export default function CookiePolicyPage() {
  return (
    <main className="bg-[#111318] text-white px-6 py-12 max-w-4xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-[#6B8DE5] mb-6">
        Politique de Cookies
      </h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">1. Qu’est-ce qu’un cookie ?</h2>
        <p className="text-gray-300">
          Un cookie est un petit fichier texte déposé sur votre appareil lors de la consultation d’un site web. Il permet de conserver des données utilisateur pour faciliter la navigation et activer certaines fonctionnalités.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">2. Utilisation des cookies</h2>
        <p className="text-gray-300">
          Cyna utilise des cookies pour améliorer l’expérience utilisateur, analyser le trafic, personnaliser le contenu et proposer des publicités ciblées.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">3. Types de cookies utilisés</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Cookies essentiels : nécessaires au bon fonctionnement du site</li>
          <li>Cookies analytiques : recueillent des données pour améliorer les performances</li>
          <li>Cookies de personnalisation : adaptent le contenu en fonction de l’utilisateur</li>
          <li>Cookies publicitaires : ciblent les publicités en fonction des intérêts</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">4. Gestion des cookies</h2>
        <p className="text-gray-300">
          Lors de votre première visite, une bannière vous permet d’accepter ou de refuser l’utilisation des cookies. Vous pouvez à tout moment modifier vos préférences via les paramètres de votre navigateur.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">5. Durée de conservation</h2>
        <p className="text-gray-300">
          Les cookies sont conservés pour une durée maximale de 13 mois après leur dépôt sur votre appareil.
        </p>
      </section>

      <p className="text-sm text-gray-500 pt-10">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>
    </main>
  );
}
