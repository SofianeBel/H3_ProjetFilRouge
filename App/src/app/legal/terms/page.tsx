export const metadata = {
  title: "Conditions Générales d’Utilisation – Cyna",
  description: "Règles encadrant l'utilisation des services Cyna.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-[#111318] text-white px-6 py-12 max-w-4xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-[#6B8DE5] mb-6">
        Conditions Générales d’Utilisation
      </h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">1. Objet</h2>
        <p className="text-gray-300">
          Les présentes conditions générales ont pour objet de définir les modalités d’accès et d’utilisation des services fournis par Cyna.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">2. Acceptation</h2>
        <p className="text-gray-300">
          L’utilisation de nos services implique l’acceptation sans réserve des présentes conditions. Toute inscription ou utilisation du site suppose l’acceptation expresse et sans réserve des présentes CGU.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">3. Accès au service</h2>
        <p className="text-gray-300">
          L’accès aux services est ouvert à tout utilisateur disposant d’un accès internet. Cyna met en œuvre tous les moyens raisonnables pour assurer un accès de qualité, sans obligation de résultat.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">4. Obligations de l’utilisateur</h2>
        <p className="text-gray-300">
          L’utilisateur s’engage à fournir des informations exactes, à respecter les lois en vigueur, à ne pas porter atteinte aux droits d’autrui et à ne pas compromettre la sécurité du service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">5. Propriété intellectuelle</h2>
        <p className="text-gray-300">
          Tous les contenus présents sur le site sont protégés par des droits de propriété intellectuelle. Toute reproduction non autorisée est strictement interdite.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">6. Responsabilité</h2>
        <p className="text-gray-300">
          Cyna décline toute responsabilité en cas d’interruption de service, de perte de données ou de dommages indirects liés à l’utilisation du site.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">7. Modification des CGU</h2>
        <p className="text-gray-300">
          Cyna se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés de toute modification significative.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8E63E5]">8. Loi applicable</h2>
        <p className="text-gray-300">
          Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
        </p>
      </section>

      <p className="text-sm text-gray-500 pt-10">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>
    </main>
  );
}
