import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique pour la page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Route protégée pour la page d'accueil */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div>Page d'accueil protégée</div>
            </PrivateRoute>
          }
        />

        {/* Redirection par défaut vers la page d'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 