import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

const Accueil = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">Bienvenue, {user?.name} !</h1>
      <p className="mt-2 text-gray-600">
        Vous êtes connecté à <strong>Cyna Secure E-commerce</strong>.
      </p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default Accueil;
