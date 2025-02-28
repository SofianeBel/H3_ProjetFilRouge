import axios from 'axios';

const API_URL = 'http://localhost:8000';

class AuthService {
    async login(email, password) {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        params.append('grant_type', 'password');

        const response = await axios.post(`${API_URL}/token`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            const user = await this.getCurrentUser();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }

        return null;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    async getCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    }

    async register(email, password, fullName) {
        return axios.post(`${API_URL}/register`, {
            email,
            password,
            full_name: fullName
        });
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }
}

export default new AuthService(); 