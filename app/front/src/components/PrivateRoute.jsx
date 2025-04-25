import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth.service';

const PrivateRoute = ({ children }) => {
    
    
    //if (!authService.isAuthenticated()) {
        // Redirection vers la page de login si non authentifié
        //return <Navigate to="/login" />;
    //}
    

    return children;
};

export default PrivateRoute; 