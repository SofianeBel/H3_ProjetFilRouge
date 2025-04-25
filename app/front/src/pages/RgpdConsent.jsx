import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8000";

const RgpdConsent = () => {
  const [consents, setConsents] = useState({
    newsletter: false,
    analytics: false,
    marketing: false,
  });

  const handleChange = (type) => {
    const updated = { ...consents, [type]: !consents[type] };
    setConsents(updated);

    axios.post(`${API_URL}/users/me/consents/`, {
      consent_type: type,
      granted: !consents[type],
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).catch(err => console.error(err.response?.data || err.message));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Préférences RGPD</h2>
      {Object.keys(consents).map((type) => (
        <label key={type} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={consents[type]}
            onChange={() => handleChange(type)}
            className="mr-2"
          />
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      ))}
    </div>
  );
};

export default RgpdConsent;
