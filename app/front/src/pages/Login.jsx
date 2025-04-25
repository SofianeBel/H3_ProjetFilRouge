import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await authService.register(email, password, fullName);
      }

      const user = await authService.login(email, password);
      if (user) navigate('/home');
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-center text-2xl font-bold">
          {isSignup ? "Créer un compte" : "Connexion"}
        </h2>

        {error && <p className="text-red-500">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="fullName"
              placeholder="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {loading ? "Chargement..." : isSignup ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {isSignup ? "Déjà inscrit ?" : "Pas encore de compte ?"}
          <span
            className="text-blue-600 hover:underline ml-2 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Se connecter" : "S'inscrire"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
