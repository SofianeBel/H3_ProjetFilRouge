import React from "react";

export default function AboutPage() {
  return (
    <main className="px-6 md:px-16 py-10 text-white bg-[#111318]">
      <h1 className="text-4xl font-bold text-primary mb-8">À propos de Cyna</h1>
      <section className="space-y-6">
        <p>
          Fondée en 2021, Cyna est née de l’expérience terrain acquise lors de nombreuses réponses à incidents de cybersécurité à travers la France et l’Europe. Notre expertise est le fruit de diagnostics approfondis et d’une analyse rigoureuse des vecteurs d’attaque.
        </p>
        <p>
          Cyna s’est donné pour mission de rendre la cybersécurité accessible, particulièrement aux PME et ETI souvent sous-équipées face aux menaces numériques. Notre approche repose sur la compréhension pragmatique des scénarios d’attaque et la mise en place de solutions adaptées.
        </p>
        <p>
          En parallèle, nous soutenons les institutions publiques et privées dans leur stratégie de protection des données sensibles, en réponse aux menaces de plus en plus sophistiquées.
        </p>
      </section>

      <h2 className="text-2xl font-semibold text-secondary mt-10 mb-4">Notre Engagement</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Mettre les priorités de nos clients au cœur de notre mission.</li>
        <li>Fournir des solutions de cybersécurité efficaces et accessibles pour PME, ETI et MSP.</li>
        <li>Accompagner nos clients dans leur parcours vers une cybersécurité renforcée.</li>
        <li>Garantir la continuité des opérations face aux risques croissants.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-secondary mt-10 mb-4">Nos Équipes</h2>
      <p>
        Nos équipes sont organisées autour de deux pôles spécialisés :
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Red Team :</strong> Réalise des pentests et diagnostics pour identifier les failles de sécurité.
        </li>
        <li>
          <strong>Blue Team :</strong> Se concentre sur la surveillance proactive et la défense contre les cybermenaces.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-secondary mt-10 mb-4">Rejoignez-nous</h2>
      <p>
        Vous êtes passionné(e) par la cybersécurité ? Envoyez-nous votre candidature. Nous sommes toujours à la recherche de nouveaux talents pour renforcer nos équipes.
      </p>
    </main>
  );
}
