import React from "react";

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-[#111318] text-white py-16 px-6 lg:px-32">
      <section className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-[#6B8DE5]">Documentation Technique</h1>

        <p className="text-gray-300 text-lg">
          Cette section présente l’ensemble des informations techniques essentielles pour comprendre le fonctionnement du site de Cyna, les intégrations logicielles, les API disponibles, ainsi que les pratiques recommandées pour garantir la cybersécurité.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#8E63E5]">1. Technologies Utilisées</h2>
            <ul className="list-disc list-inside text-gray-400 mt-2">
              <li>Frontend : Next.js 14 avec App Router + TypeScript</li>
              <li>UI : Tailwind CSS + Shadcn UI</li>
              <li>Backend : Next.js API Routes</li>
              <li>Base de données : PostgreSQL avec Prisma</li>
              <li>Authentification : NextAuth.js</li>
              <li>Envoi d’emails : Resend</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#8E63E5]">2. API REST</h2>
            <p className="text-gray-400 mt-2">
              Une API REST est disponible pour les opérations comme le contact, les utilisateurs, ou encore les commandes. Par exemple :
            </p>
            <pre className="bg-[#161A22] p-4 rounded text-sm mt-2 overflow-x-auto">
              POST /api/contact {"\n"}
              {"{ name, email, company, service, message }"}
            </pre>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#8E63E5]">3. Sécurité</h2>
            <ul className="list-disc list-inside text-gray-400 mt-2">
              <li>Protection CSRF intégrée à Next.js</li>
              <li>Validation des entrées via Zod</li>
              <li>Variables d’environnement sécurisées</li>
              <li>En-têtes HTTP renforcés</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#8E63E5]">4. Structure du Projet</h2>
            <pre className="bg-[#161A22] p-4 rounded text-sm overflow-x-auto">
              /src/app/ → Routing des pages {"\n"}
              /components/layout → Header & Footer {"\n"}
              /app/api/ → Routes backend {"\n"}
              /public → Assets statiques {"\n"}
              /prisma → Schéma de base de données
            </pre>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#8E63E5]">5. Déploiement</h2>
            <p className="text-gray-400 mt-2">
              L’hébergement est effectué via <strong>Vercel</strong>, permettant un déploiement continu à partir du repository GitHub.
              Les variables sensibles sont gérées via `.env.local` et `.env.production`.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#8E63E5]">6. Aide & Support</h2>
            <p className="text-gray-400 mt-2">
              Pour toute question technique, vous pouvez contacter l’équipe à <strong>dev@cyna-it.fr</strong> ou consulter la documentation interne disponible à l’adresse :
              <br />
              <a href="https://docs.cyna-it.fr" className="text-[#A67FFB] underline">
                docs.cyna-it.fr
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
