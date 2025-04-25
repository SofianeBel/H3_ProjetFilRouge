import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import axios from 'axios';

const API_URL = "http://localhost:8000";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      setProducts(res.data);
    }).catch((err) => {
      console.error("Erreur lors du chargement des produits :", err);
    });
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-600">Cyna E-commerce</h1>
        <div className="space-x-4">
          <button onClick={handleProfile} className="text-sm text-gray-700 hover:text-blue-600">Mon profil</button>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Déconnexion</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-50 py-10 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Découvrez nos solutions SaaS de sécurité</h2>
        <p className="text-gray-600 mt-2">Produits SOC, EDR, XDR adaptés à vos besoins</p>
      </section>

      {/* Product Slider */}
      <section className="px-6 py-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Nos Produits</h3>
        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="min-w-[250px] bg-white rounded shadow p-4">
              <img src={product.image_url || "/placeholder.jpg"} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
              <h4 className="font-bold text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="mt-2 text-blue-600 font-semibold">{product.price} €</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
