import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RgpdGate = () => {
  const [consentGiven, setConsentGiven] = useState(false);
  const navigate = useNavigate();

  const handleConsent = () => {
    setConsentGiven(true);
    localStorage.setItem('rgpd_consent', 'true');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur Cyna E-commerce</h1>
      <p className="mb-6 text-center max-w-xl">
        Avant de continuer, veuillez accepter nos politiques de confidentialité et de traitement
        des données personnelles (conformément au RGPD).
      </p>

      <div className="mb-4 text-left max-w-lg text-sm text-gray-700">
        <p>✔️ Nous utilisons vos données uniquement pour :</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Créer et gérer votre compte utilisateur</li>
          <li>Vous permettre d'effectuer des achats en toute sécurité</li>
          <li>Vous notifier sur vos commandes ou offres</li>
        </ul>
      </div>

      <button
        onClick={handleConsent}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        J’accepte et continue
      </button>
    </div>
  );
};

export default RgpdGate;
