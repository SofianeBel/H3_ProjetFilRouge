import React, { useState, useEffect } from 'react';
import UsersList from './UsersList';
import UserForm from './UserForm';
import userService from '../../../services/user.service';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'

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

  // Ouvrir le formulaire d'ajout
  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  // Ouvrir le formulaire d'édition
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
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

  // Soumettre le formulaire (ajout ou édition)
  const handleSubmit = async (userData) => {
    try {
      if (modalMode === 'add') {
        const response = await userService.create(userData);
        setUsers([...users, response.data]);
      } else {
        const response = await userService.update(selectedUser.id, userData);
        setUsers(users.map(user => user.id === selectedUser.id ? response.data : user));
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(`Erreur lors de l'${modalMode === 'add' ? 'ajout' : 'édition'} de l'utilisateur`);
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Gestion des Utilisateurs</h2>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Ajouter un utilisateur
        </button>
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
          onEdit={handleEditUser} 
          onDelete={handleDeleteUser} 
        />
      )}

      {isModalOpen && (
        <UserForm
          user={selectedUser}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default UsersManagement; 