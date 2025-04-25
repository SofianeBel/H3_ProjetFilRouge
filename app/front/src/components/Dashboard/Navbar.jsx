import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const Navbar = ({ onMenuButtonClick, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Extraire les initiales du nom complet
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Section gauche: Bouton de menu (visible en mobile) et recherche */}
          <div className="flex items-center">
            {/* Bouton de menu mobile */}
            <button
              onClick={onMenuButtonClick}
              className="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Barre de recherche */}
            <div className="relative ml-4 lg:ml-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section droite: Notifications et Profil */}
          <div className="flex items-center space-x-4">
            {/* Bouton notifications */}
            <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
              <span className="sr-only">Voir les notifications</span>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Badge de notification */}
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </div>
            </button>

            {/* Bouton messages */}
            <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
              <span className="sr-only">Voir les messages</span>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {/* Badge message */}
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </div>
            </button>

            {/* Séparateur vertical */}
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

            {/* Menu profil utilisateur */}
            <div className="relative">
              <button 
                className="flex items-center focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className={`h-8 w-8 rounded-full ${user?.role === 'admin' ? 'bg-indigo-600' : 'bg-green-600'} flex items-center justify-center text-white`}>
                  {getInitials(user?.full_name)}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.full_name || 'Utilisateur'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-5 w-5 text-gray-400 hidden sm:block" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur standard'}
                    </p>
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mon profil
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Paramètres
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 