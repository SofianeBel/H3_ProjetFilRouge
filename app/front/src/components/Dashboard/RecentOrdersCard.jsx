import React from 'react';

const RecentOrdersCard = () => {
  // Données factices pour les commandes récentes
  const orders = [
    { id: '8743', customer: 'Jean Dupont', date: '14 Oct 2023', amount: '154.90 €', status: 'completed' },
    { id: '8742', customer: 'Marie Martin', date: '13 Oct 2023', amount: '287.30 €', status: 'processing' },
    { id: '8741', customer: 'Paul Bernard', date: '12 Oct 2023', amount: '74.20 €', status: 'completed' },
    { id: '8740', customer: 'Sophie Petit', date: '11 Oct 2023', amount: '213.50 €', status: 'pending' },
    { id: '8739', customer: 'Thomas Richard', date: '10 Oct 2023', amount: '92.40 €', status: 'completed' },
  ];

  // Fonction pour obtenir les classes de status en fonction de l'état
  const getStatusClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour traduire le statut en français
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'processing':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Commandes récentes</h2>
        <p className="text-sm text-gray-500">Liste des 5 dernières commandes</p>
      </div>

      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order.id} className="px-6 py-4 flex items-center">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {order.customer}
                </p>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                  ${getStatusClasses(order.status)}">
                  <span className={`mr-1 flex-shrink-0 h-2 w-2 rounded-full ${
                    order.status === 'completed' ? 'bg-green-500' : 
                    order.status === 'processing' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></span>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="mt-1 flex">
                <p className="text-sm text-gray-500">
                  Commande #{order.id}
                </p>
                <p className="ml-3 text-sm text-gray-500">
                  {order.date}
                </p>
              </div>
            </div>
            <div className="ml-5 flex-shrink-0">
              <p className="text-sm font-medium text-gray-900">{order.amount}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Voir toutes les commandes →
        </a>
      </div>
    </div>
  );
};

export default RecentOrdersCard; 