import React from 'react';

// Pour un graphique réel, vous devriez utiliser une bibliothèque comme 
// Chart.js (react-chartjs-2), Recharts, ou Victory
// Ici, nous allons simuler un graphique avec du HTML/CSS pour simplifier

const ChartCard = () => {
  // Données factices pour le graphique des ventes
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const data = [30, 40, 35, 50, 49, 60, 70, 91, 86, 95, 80, 100];
  const maxValue = Math.max(...data);

  // Options de période
  const periodOptions = ['Année', 'Mois', 'Semaine', 'Jour'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* En-tête avec titre et périodes */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Ventes</h2>
          <p className="text-sm text-gray-500">Aperçu des ventes sur les 12 derniers mois</p>
        </div>
        <div className="flex space-x-2">
          {periodOptions.map((period, index) => (
            <button 
              key={index}
              className={`px-3 py-1 text-sm rounded-md ${
                index === 0 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Corps de la carte avec le "graphique" */}
      <div className="p-6">
        {/* Simuler un graphique avec des barres CSS */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between">
            {data.map((value, index) => (
              <div key={index} className="w-full px-1 flex flex-col items-center">
                <div 
                  className="w-full bg-indigo-500 rounded-t"
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    opacity: 0.7 + (index / data.length) * 0.3 // Variation de l'opacité pour l'effet visuel
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{months[index]}</span>
              </div>
            ))}
          </div>
          
          {/* Lignes horizontales de repère */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index} 
                className="w-full h-px bg-gray-200 flex items-center"
              >
                <span className="text-xs text-gray-400 mr-2">
                  {Math.round(maxValue - (index * (maxValue / 4)))}€
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pied de carte avec statistiques globales */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Ventes totales</p>
            <p className="text-lg font-semibold text-gray-900">648,924 €</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Taux de conversion</p>
            <p className="text-lg font-semibold text-gray-900">4.8%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Croissance</p>
            <p className="text-lg font-semibold text-green-600">+23.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartCard; 