import React, { useState, useEffect } from 'react';
import UsersList from './UsersList';
import userService from '../../../services/user.service';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
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
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-6 text-center">Chargement des utilisateurs...</div>
      ) : (
        <UsersList 
          users={users} 
          onEdit={() => alert('La fonctionnalité d\'édition sera disponible prochainement.')} 
          onDelete={handleDeleteUser} 
        />
      )}
    </div>
  );
};

export default UsersManagement; 