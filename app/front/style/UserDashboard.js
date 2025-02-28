import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000"; // FastAPI server URL

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        console.error("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={styles.container}>
      <h2>User Dashboard</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <h3>Order History</h3>
          <ul>
            {user.orders.map((order, index) => (
              <li key={index}>{order}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px" },
};

export default UserDashboard;
