import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ChatBox from "../../page/order/chat/ChatBox";
import Oderslidebar from "../../components/sidebar/oderslidebar";

const DeliverHome = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const headingText = "Welcome to Order & Deliver Home";
  const splitHeadingText = headingText.split("");
  const subText = "Your one-stop solution for all your delivery needs";
  const splitSubText = subText.split(" ");

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Oderslidebar />
      <motion.div
        className="flex flex-col items-center justify-center flex-1 relative text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: "linear-gradient(135deg, #1e2a44, #3b4a6b)", // Deep slate blue gradient
          color: "#fff",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Centered Heading and Subtext */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {splitHeadingText.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.8 }}
                className="inline-block text-emerald-400 hover:text-emerald-300 transition-colors drop-shadow-lg"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl font-light text-gray-200 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {splitSubText.map((word, index) => (
              <motion.span
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                className="inline-block mx-1.5 text-emerald-200 drop-shadow-md"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <motion.div
          className="relative z-10 mt-12 w-full max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <ChatBox />
        </motion.div>

        <motion.div
          className="absolute top-6 right-6 bg-emerald-600 text-white px-6 py-2.5 rounded-lg cursor-pointer shadow-xl z-20 hover:bg-emerald-700 transition-all duration-300"
          onClick={handleProfileClick}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg font-medium">My Profile</span>
        </motion.div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
      </motion.div>
    </div>
  );
};

export default DeliverHome;
