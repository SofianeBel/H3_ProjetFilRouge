import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RgpdGate from './pages/RgpdGate';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import PrivateRoute from './components/PrivateRoute';
import RgpdConsent from './pages/RgpdConsent';
import ProfilePage from './pages/ProfilePage';

function App() {
  const hasConsent = true; // Replace with actual logic to check user consent

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />

        <Route path="/welcome" element={<RgpdGate />} />
        <Route path="/login" element={hasConsent ? <Login /> : <Navigate to="/welcome" />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/rgpd"
          element={
            <PrivateRoute>
              <RgpdConsent />
            </PrivateRoute>
          }
        />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  );
}


export default App; 