import axios from 'axios';
import authService from './auth.service';

// URL de base de l'API - assurez-vous qu'elle correspond à votre serveur FastAPI
const API_URL = 'http://localhost:8000';

class UserService {
  async getAll() {
    try {
      const token = authService.getToken();
      console.log('Token utilisé pour la requête:', token ? 'Token présent' : 'Aucun token');
      
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        throw new Error('Authentification requise');
      }
      
      console.log('Tentative de récupération des utilisateurs depuis:', `${API_URL}/users`);
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Réponse des utilisateurs:', response.data);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error.response?.data || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      const token = authService.getToken();
      console.log(`Tentative de récupération de l'utilisateur ID:${id}`);
      return await axios.get(`${API_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ID:${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async create(userData) {
    try {
      const token = authService.getToken();
      console.log('Tentative de création d\'utilisateur avec données:', userData);
      return await axios.post(`${API_URL}/users`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création d\'utilisateur:', error.response?.data || error.message);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      const token = authService.getToken();
      console.log(`Tentative de mise à jour de l'utilisateur ID:${id} avec données:`, userData);
      return await axios.put(`${API_URL}/users/${id}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ID:${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      const token = authService.getToken();
      console.log(`Tentative de suppression de l'utilisateur ID:${id}`);
      return await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ID:${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
}

// Assigner l'instance à une variable avant de l'exporter
const userService = new UserService();
export default userService; 