'use client';

import React from 'react';

export default function IncidentResponsePage() {
  return (
    <main className="bg-dark text-white py-12 px-6 sm:px-16">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Réponse à Incident – Cyna CERT
        </h1>
        <p className="text-lg max-w-3xl mx-auto">
          En cas d’attaque ou d’incident de cybersécurité, notre équipe Cyna CERT est disponible 24/7 pour intervenir rapidement et efficacement.
        </p>
        <a
          href="#contact"
          className="btn-primary mt-6 inline-block px-6 py-3 rounded-lg"
        >
          Contacter le CERT
        </a>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Notre Équipe CERT</h2>
        <ul className="grid sm:grid-cols-2 gap-6 text-sm">
          <li>
            <strong>Gestionnaire de crise :</strong> Organise la réponse avec toutes les parties prenantes.
          </li>
          <li>
            <strong>Analyste spécialisé :</strong> Investigue les attaques, collecte les preuves et émet des recommandations.
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Notre Méthodologie en 6 Étapes</h2>
        <ol className="list-decimal list-inside space-y-3">
          <li>Contact initial et qualification</li>
          <li>Constitution de l’équipe de réponse</li>
          <li>Collecte de preuves</li>
          <li>Identification et confinement</li>
          <li>Rétablissement</li>
          <li>Rapport final & recommandations</li>
        </ol>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Pourquoi choisir Cyna CERT ?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Équipe expérimentée et certifiée</li>
          <li>Partenaire de l’InterCERT</li>
          <li>Plus de 200 incidents traités/an</li>
        </ul>
      </section>

      <section id="contact" className="bg-dark-secondary p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-semibold mb-4">Vous êtes victime ? Contactez-nous !</h2>
        <p className="mb-4">
          En cas d’urgence :
        </p>
        <ul className="space-y-2 text-sm">
          <li>Email : <a href="mailto:cert@cyna.fr" className="text-primary">cert@cyna.fr</a></li>
          <li>Téléphone : +33 1 23 45 67 89</li>
          <li>RFC 2350 : <a href="/rfc2350.pdf" className="text-primary underline">Télécharger</a></li>
          <li>Clé PGP : <code>0x1234567890ABCDEF</code></li>
          <li>Empreinte : <code>ABCD 1234 EF56 7890 ...</code></li>
        </ul>
      </section>
    </main>
  );
}
