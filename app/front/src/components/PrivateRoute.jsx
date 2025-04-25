import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth.service';

const PrivateRoute = ({ children }) => {
    // Vérifier si l'utilisateur est authentifié
    if (!authService.isAuthenticated()) {
        // Redirection vers la page de login si non authentifié
        return <Navigate to="/login" />;
    }
    
    // Si l'utilisateur est authentifié, afficher le contenu protégé
    return children;
};

export default PrivateRoute; 