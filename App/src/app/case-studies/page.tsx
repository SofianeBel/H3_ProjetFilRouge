import React from "react";

export default function CaseStudiesPage() {
  return (
    <main className="px-6 md:px-16 py-10 text-white bg-[#111318]">
      <h1 className="text-4xl font-bold text-primary mb-8">Études de cas</h1>

      <section className="space-y-8">
        <div className="card-cyna bg-[#161A22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary">Récupération après ransomware dans une PME</h2>
          <p className="mt-2">
            Une PME dans le secteur de la logistique a subi une attaque de type ransomware paralysant tous ses systèmes.
            Grâce à notre solution XDR et à une intervention rapide de notre équipe Blue Team, les systèmes ont été
            restaurés et les failles comblées en moins de 48h. Aucune donnée sensible n’a été compromise.
          </p>
        </div>

        <div className="card-cyna bg-[#161A22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary">Sécurisation d’infrastructure IT pour une collectivité</h2>
          <p className="mt-2">
            Nous avons été sollicités par une collectivité locale pour sécuriser son infrastructure face aux menaces
            croissantes. Après un audit complet, nous avons mis en œuvre une solution SOC sur mesure intégrant une surveillance
            24/7 et des alertes en temps réel.
          </p>
        </div>

        <div className="card-cyna bg-[#161A22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-secondary">Test d’intrusion réussi chez un MSP</h2>
          <p className="mt-2">
            Lors d’un test de pénétration commandé par un MSP, notre Red Team a pu identifier des failles critiques
            dans les permissions réseau. Ces vulnérabilités ont été corrigées immédiatement, renforçant la sécurité
            globale de l’écosystème client.
          </p>
        </div>
      </section>
    </main>
  );
}
