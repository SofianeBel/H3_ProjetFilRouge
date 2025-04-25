import axios from 'axios';
import authService from './auth.service';

const API_URL = 'http://localhost:8000';

class UserService {
  getAll() {
    return axios.get(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
  }

  getById(id) {
    return axios.get(`${API_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
  }

  create(userData) {
    return axios.post(`${API_URL}/users`, userData, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
  }

  update(id, userData) {
    return axios.put(`${API_URL}/users/${id}`, userData, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
  }

  delete(id) {
    return axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
  }
}

export default new UserService(); 