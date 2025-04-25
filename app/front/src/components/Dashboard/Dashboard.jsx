import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import RecentOrdersCard from './RecentOrdersCard';
import UsersManagement from './Users/UsersManagement';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Données factices pour les statistiques
  const stats = [
    { id: 1, title: 'Ventes Totales', value: '12,890 €', change: '+12%', icon: 'shopping-cart' },
    { id: 2, title: 'Nouveaux Clients', value: '385', change: '+8%', icon: 'user' },
    { id: 3, title: 'Commandes', value: '642', change: '+5%', icon: 'shopping-bag' },
    { id: 4, title: 'Revenue Mensuel', value: '48,568 €', change: '+18%', icon: 'chart-bar' },
  ];

  // Fonction pour afficher le contenu en fonction de la route
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/users') {
      return <UsersManagement />;
    } else if (path === '/products') {
      return <div>Page des produits en construction</div>;
    } else if (path === '/orders') {
      return <div>Page des commandes en construction</div>;
    } else if (path === '/customers') {
      return <div>Page des clients en construction</div>;
    } else if (path === '/analytics') {
      return <div>Page des statistiques en construction</div>;
    } else if (path === '/settings') {
      return <div>Page des paramètres en construction</div>;
    } else {
      // Page d'accueil du dashboard par défaut
      return (
        <>
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tableau de bord</h1>
          
          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <StatCard key={stat.id} title={stat.title} value={stat.value} change={stat.change} icon={stat.icon} />
            ))}
          </div>
          
          {/* Section graphiques et données récentes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graphique des ventes (prend 2/3 sur grand écran) */}
            <div className="lg:col-span-2">
              <ChartCard />
            </div>
            
            {/* Commandes récentes (prend 1/3 sur grand écran) */}
            <div className="lg:col-span-1">
              <RecentOrdersCard />
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar mobile - s'affiche comme un overlay */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuButtonClick={() => setSidebarOpen(true)} />

        {/* Contenu du dashboard avec défilement */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 