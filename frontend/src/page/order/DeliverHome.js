import React from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import ChatBox from "../../page/order/chat/ChatBox";

const DeliverHome = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Split the text into individual letters for the heading
  const headingText = "Welcome to Deliver Home";
  const splitHeadingText = headingText.split("");

  // Split the subtext into words
  const subText = "Your one-stop solution for all your delivery needs";
  const splitSubText = subText.split(" ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #2d3748, #4a5568)", // Professional gray gradient
        color: "#fff",
        textAlign: "center",
        overflow: "hidden",
        position: "relative", // Ensure content is above canvas
      }}
    >
      {/* 3D Sphere Animation */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0, // Ensure 3D canvas is behind other elements
          width: "100%",
          height: "100%",
        }}
        camera={{ position: [0, 0, 5] }}
      >
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial attach="material" color="#4682B4" wireframe />
        </Sphere>
      </Canvas>

      {/* Heading with Falling Effect and Color Change */}
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          letterSpacing: "1.5px",
          position: "relative",
          zIndex: 1, // Keep the heading on top of the canvas
          textShadow: "0 0 10px black, 0 0 20px black, 0 0 30px black", // Black outline effect
        }}
      >
        {splitHeadingText.map((letter, index) => (
          <motion.span
            key={index}
            initial={{
              y: -100, // Start off above
              color: "white", // Start with white color
            }}
            animate={{
              y: 0, // Fall to its original position
              color: "green", // Transition from white to green
            }}
            transition={{
              delay: index * 0.1, // Staggered delay
              duration: 1.5, // Smooth transition duration
            }}
            style={{
              display: "inline-block",
              color: "white", // Start color is white, then transition to green
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtext with Falling Effect and Green Color Animation */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
        style={{
          fontSize: "1.2rem",
          margin: "20px 0",
          zIndex: 1, // Ensure subtext is above the canvas
          textShadow: "0 0 10px black, 0 0 20px black, 0 0 30px black", // Black outline effect for subtext
        }}
      >
        {splitSubText.map((word, index) => (
          <motion.span
            key={index}
            initial={{
              y: 50, // Start below the screen
              color: "white", // Start with white color
            }}
            animate={{
              y: 0, // Move to original position
              color: "green", // Transition from white to green
            }}
            transition={{
              delay: index * 0.3, // Stagger the appearance of words
              duration: 1.5, // Smooth transition duration
            }}
            style={{
              display: "inline-block",
              color: "white", // Start color is white, then transition to green
              margin: "0 5px", // Space out the words
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>

      {/* Chatbox */}
      <div style={{ zIndex: 1 }}>
        <ChatBox />
      </div>

      {/* My Profile Button with 3D Hover Effect on Top Right */}
      <motion.div
        onClick={handleProfileClick}
        style={{
          position: "absolute",
          top: "20px", // Position the button near the top
          right: "20px", // Align it to the right side
          background: "green", // Green color for the button
          color: "#fff",
          padding: "15px 30px",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
          fontSize: "1.2rem",
          zIndex: 2, // Ensure button is above everything else
          transition: "all 0.3s ease",
        }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        My Profile
      </motion.div>
    </motion.div>
  );
};

export default DeliverHome;
