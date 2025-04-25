import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8000";

const ProfilePage = () => {
  const [user, setUser] = useState({ full_name: "", email: "" });
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setUser(res.data));
  }, []);

  const handleUpdate = () => {
    axios.put(`${API_URL}/users/${user.id}`, {
      full_name: user.full_name,
      email: user.email,
      password,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(() => alert("Profil mis à jour"))
      .catch(err => alert("Erreur: " + (err.response?.data?.detail || err.message)));
  };

  const handleDelete = () => {
    if (window.confirm("Confirmez-vous la suppression de votre compte ?")) {
      axios.delete(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(() => {
        localStorage.clear();
        window.location.href = "/login";
      });
    }
  };

  const handleExport = () => {
    axios.get(`${API_URL}/users/me/export`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "user_data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mon Profil</h2>
      <input
        className="w-full mb-2 p-2 border"
        value={user.full_name}
        onChange={(e) => setUser({ ...user, full_name: e.target.value })}
        placeholder="Nom complet"
      />
      <input
        className="w-full mb-2 p-2 border"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
      />
      <input
        className="w-full mb-2 p-2 border"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
      />
      <div className="flex justify-between mt-4">
        <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Mettre à jour</button>
        <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded">Exporter</button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Supprimer</button>
      </div>
    </div>
  );
};

export default ProfilePage;
