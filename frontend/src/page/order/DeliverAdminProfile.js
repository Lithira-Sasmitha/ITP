import React, { useState } from "react";
import { motion } from "framer-motion";

import background from "../../assets/DeliverAdminbackground.jpg";

const DeliverAdminProfile = () => {
  const [name, setName] = useState("Buddhi");
  const [email, setEmail] = useState("buddhi@example.com");
  const [phone, setPhone] = useState("+94 77 123 4567");
  const [address, setAddress] = useState("123 Main Street, Colombo, Sri Lanka");
  const [dob, setDob] = useState("January 1, 1990");
  const [position, setPosition] = useState("Delivery Administrator");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here (e.g., update the database or state)
    alert("Profile Updated!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{
        textAlign: "center",
        marginTop: "50px",
        backgroundImage: `url(${background})`, // Set background image
        backgroundSize: "cover", // Cover the entire page
        backgroundPosition: "center",
        padding: "60px 40px",
        borderRadius: "20px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        maxWidth: "900px",
        margin: "50px auto",
        color: "#333", // Dark text color for better contrast
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "rgba(255, 255, 255, 0.85)", // Light transparent background
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          letterSpacing: "1px",
          color: "#2C3E50", // Darker text for header
          marginBottom: "20px",
        }}
      >
        Deliver Admin Profile
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
        style={{
          fontSize: "1.3rem",
          marginBottom: "30px",
          color: "#2980B9", // A vibrant blue color for the text
          fontWeight: "500", // Make the text slightly bolder
          fontFamily: "'Roboto', sans-serif", // Modern font for a sleek look
          textShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle text shadow for depth
        }}
      >
        <span
          style={{ fontSize: "1.5rem", fontWeight: "600", color: "#16A085" }}
        >
          Welcome, Buddhi!
        </span>{" "}
        This is your profile page where you can view and manage your personal
        information.
      </motion.p>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly stronger overlay for content area
          padding: "30px",
          borderRadius: "15px",
          textAlign: "left",
          marginBottom: "40px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{ marginBottom: "20px", fontSize: "1.6rem", color: "#34495E" }}
        >
          Personal Information
        </h2>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="name" style={{ fontSize: "1rem", display: "block" }}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="email" style={{ fontSize: "1rem", display: "block" }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="phone" style={{ fontSize: "1rem", display: "block" }}>
            Phone:
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="address"
            style={{ fontSize: "1rem", display: "block" }}
          >
            Address:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="dob" style={{ fontSize: "1rem", display: "block" }}>
            Date of Birth:
          </label>
          <input
            type="text"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="position"
            style={{ fontSize: "1rem", display: "block" }}
          >
            Position:
          </label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <motion.button
          type="submit"
          style={{
            backgroundColor: "#1E88E5",
            color: "#fff",
            padding: "15px 35px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1.1rem",
            border: "none",
            transition: "all 0.3s ease",
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          Save Changes
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default DeliverAdminProfile;
