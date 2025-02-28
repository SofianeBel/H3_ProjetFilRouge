import React from "react";
import { Link } from "react-router-dom";

const Accueil = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Cyna Secure E-commerce</h1>
      <p>
        Cyna specializes in SaaS security solutions (SOC, EDR, XDR). We are
        building a secure e-commerce platform for international clients,
        featuring a mobile-first website, a companion mobile app, and a
        back-office system to manage products, users, orders, and payments.
      </p>
      <div style={styles.links}>
        <Link to="/login" style={styles.button}>Login</Link>
        <Link to="/signup" style={styles.button}>Sign Up</Link>
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px" },
  links: { marginTop: "20px" },
  button: {
    margin: "10px",
    padding: "10px 20px",
    textDecoration: "none",
    background: "#007bff",
    color: "white",
    borderRadius: "5px",
  },
};

export default Accueil;
