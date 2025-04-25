import React, { useState, useEffect } from 'react';
import UsersList from './UsersList';
import userService from '../../../services/user.service';
import authService from '../../../services/auth.service';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);

  // Vérifier l'authentification et charger les utilisateurs au montage
  useEffect(() => {
    checkAuthAndLoadUsers();
  }, []);

  // Vérifier l'authentification et charger les utilisateurs
  const checkAuthAndLoadUsers = async () => {
    try {
      // Vérifier si l'utilisateur est authentifié
      const token = authService.getToken();
      if (!token) {
        setAuthStatus('Non authentifié - veuillez vous connecter');
        setError('Authentification requise pour accéder aux données');
        return;
      }
      
      setAuthStatus('Authentifié');
      await fetchUsers();
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'authentification:', err);
      setAuthStatus('Erreur d\'authentification');
      setError('Erreur lors de la vérification de l\'authentification');
    }
  };

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Tentative de récupération des utilisateurs...');
      const response = await userService.getAll();
      console.log('Utilisateurs récupérés:', response.data);
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Erreur complète:', err);
      let errorMessage = 'Erreur lors du chargement des utilisateurs';
      
      if (err.response) {
        // Erreur de réponse du serveur
        errorMessage += ` - Statut: ${err.response.status}`;
        if (err.response.data && err.response.data.detail) {
          errorMessage += ` - ${err.response.data.detail}`;
        }
      } else if (err.request) {
        // Pas de réponse reçue
        errorMessage += ' - Aucune réponse du serveur';
      } else {
        // Erreur lors de la configuration de la requête
        errorMessage += ` - ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.delete(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Erreur lors de la suppression de l\'utilisateur');
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Gestion des Utilisateurs</h2>
        {authStatus && (
          <p className={`text-sm mt-1 ${authStatus.includes('Non') || authStatus.includes('Erreur') ? 'text-red-500' : 'text-green-500'}`}>
            Statut: {authStatus}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 m-4 rounded">
          <p className="font-bold">Erreur:</p>
          <p>{error}</p>
          <button 
            onClick={checkAuthAndLoadUsers} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-6 text-center">
          <p className="text-gray-600">Chargement des utilisateurs...</p>
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          {!error && users.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Aucun utilisateur trouvé. Vérifiez que votre API back-end fonctionne correctement.
            </div>
          )}
          {users.length > 0 && (
            <UsersList 
              users={users} 
              onEdit={() => alert('La fonctionnalité d\'édition sera disponible prochainement.')} 
              onDelete={handleDeleteUser} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default UsersManagement; 