import React from 'react';

const solutions = [
  {
    title: 'Audit',
    description: 'Évaluez la sécurité de votre système avec nos audits rigoureux.',
  },
  {
    title: 'Pentest',
    description: 'Identifiez les vulnérabilités de votre réseau grâce à des tests d’intrusion experts.',
  },
  {
    title: 'SOC 24/7',
    description: 'Surveillez votre infrastructure 24/7 avec notre centre opérationnel de sécurité.',
  },
  {
    title: 'Cyna CERT',
    description: 'Intervention rapide en cas d’incident avec notre équipe de réponse certifiée.',
  },
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-dark text-white px-6 py-16">
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-primary">Solutions & Services</h1>
        <p className="text-lg text-gray-300 mb-10">
          Des solutions de cybersécurité adaptées à vos besoins, opérées par des experts reconnus.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((sol, idx) => (
            <div
              key={idx}
              className="bg-darkSecondary p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold text-accent mb-2">{sol.title}</h3>
              <p className="text-gray-400">{sol.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <a
            href="/contact"
            className="btn-primary px-6 py-3 text-white font-semibold rounded-md"
          >
            Contactez-nous pour en savoir plus
          </a>
        </div>
      </section>
    </main>
  );
}
