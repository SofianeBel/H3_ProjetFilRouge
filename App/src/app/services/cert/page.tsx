export const metadata = {
  title: "Réponse à Incident – Cyna",
  description: "Plan d'action de Cyna en cas d'incident de sécurité ou de faille.",
};

export default function IncidentResponsePage() {
  return (
    <main className="bg-[#111318] text-white px-6 py-12 max-w-4xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-[#6B8DE5] mb-6">Réponse à Incident</h1>

      <section className="space-y-4">
        <p className="text-gray-300">
          Cyna prend très au sérieux la sécurité de ses systèmes et des données personnelles de ses utilisateurs. Nous avons mis en place une politique de réponse aux incidents pour réagir rapidement et efficacement en cas d’incident de sécurité.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">1. Détection d'incident</h2>
        <p className="text-gray-300">
          Nous utilisons des outils de surveillance automatisés pour détecter tout comportement anormal ou accès non autorisé sur notre plateforme.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">2. Notification et communication</h2>
        <p className="text-gray-300">
          En cas d’incident majeur, nous nous engageons à informer les utilisateurs concernés dans les plus brefs délais et à notifier les autorités compétentes si nécessaire.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">3. Mesures correctives</h2>
        <p className="text-gray-300">
          Une fois l'incident identifié, nous appliquons immédiatement les mesures nécessaires pour limiter les dégâts, corriger les failles et éviter toute récurrence.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">4. Amélioration continue</h2>
        <p className="text-gray-300">
          Chaque incident est documenté et analysé afin d’améliorer nos processus et renforcer la résilience de notre infrastructure.
        </p>
      </section>

      <p className="text-sm text-gray-500 pt-10">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>
    </main>
  );
}
