import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import RecentOrdersCard from './RecentOrdersCard';
import UsersManagement from './Users/UsersManagement';
import authService from '../../services/auth.service';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer les informations de l'utilisateur au chargement
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Récupérer les informations de l'utilisateur depuis le localStorage
        const userJson = localStorage.getItem('user');
        
        if (userJson) {
          setCurrentUser(JSON.parse(userJson));
        } else {
          // Si pas d'utilisateur en localStorage, essayer de le récupérer du serveur
          const user = await authService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Données factices pour les statistiques
  const stats = [
    { id: 1, title: 'Ventes Totales', value: '12,890 €', change: '+12%', icon: 'shopping-cart' },
    { id: 2, title: 'Nouveaux Clients', value: '385', change: '+8%', icon: 'user' },
    { id: 3, title: 'Commandes', value: '642', change: '+5%', icon: 'shopping-bag' },
    { id: 4, title: 'Revenue Mensuel', value: '48,568 €', change: '+18%', icon: 'chart-bar' },
  ];

  // Vérifier si l'utilisateur est administrateur
  const isAdmin = currentUser && currentUser.role === 'admin';

  // Fonction pour afficher le contenu en fonction de la route et des droits d'accès
  const renderContent = () => {
    const path = location.pathname;
    
    // Si l'utilisateur tente d'accéder à une page réservée aux administrateurs
    if ((path === '/users') && !isAdmin) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Vous n'avez pas les droits suffisants pour accéder à cette page. Cette fonctionnalité est réservée aux administrateurs.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    if (path === '/users') {
      return isAdmin ? <UsersManagement /> : null;
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
          
          {/* Message de bienvenue avec les informations de l'utilisateur */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Bienvenue, {currentUser?.full_name || 'Utilisateur'}
            </h2>
            <p className="text-sm text-gray-600">
              Vous êtes connecté en tant que: <span className="font-medium">{currentUser?.role || 'utilisateur'}</span>
              {!isAdmin && (
                <span className="text-xs ml-2 text-gray-500">
                  (Certaines fonctionnalités sont réservées aux administrateurs)
                </span>
              )}
            </p>
          </div>
          
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

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar mobile - s'affiche comme un overlay */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isAdmin={isAdmin} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuButtonClick={() => setSidebarOpen(true)} user={currentUser} />

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