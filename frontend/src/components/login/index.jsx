import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "./background.jpg";
import logo from "../../assets/logo.png";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    
    // Reset previous errors
    setEmailError("");
    setPasswordError("");
    
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      toast.error("Please enter your email");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      toast.error("Invalid email format");
      isValid = false;
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError("Password is required");
      toast.error("Please enter your password");
      isValid = false;
    }
    
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const userCredentials = { email, password };

    try {
      const result = await axios.post("http://localhost:5000/api/users/login", userCredentials);
      setLoading(false);

      if (result.data.success) {
        toast.success("Login successful!");
        localStorage.setItem("currentuser", JSON.stringify(result.data.user));
        localStorage.setItem("user:detail", JSON.stringify(result.data.user));

        const role = result.data.user.role;
      
        switch (role) {
          case "User":
            navigate("/product");
            break;
          case "Employee manager":
            navigate("/employeeDashboard");
            break;
          case "Order manager":
            navigate("/DeliverHome");
            break;
          case "Inventory manager":
            navigate("/inventory/dashboard");
            break;
          case "Financial manager":
            navigate("/financialdashboard");
            break;
          case "Machine manager":
            navigate("/machinedashboard");
            break;
          default:
            console.error("Unsupported role:", role);
            setErrorMessage("Unsupported user role.");
            setShowErrorPopup(true);
        }
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password. Please try again.");
        setShowErrorPopup(true);
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        setShowErrorPopup(true);
      } else {
        setErrorMessage("Login failed. Please try again later.");
        setShowErrorPopup(true);
      }
    }
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 z-0"
      />

      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="absolute top-6 left-6 w-16 h-16 rounded-full z-10 shadow-xl"
      />

      {/* Error Popup */}
      <AnimatePresence>
        {showErrorPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="absolute inset-0 bg-black/60" onClick={closeErrorPopup}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Login Failed</h3>
              <p className="text-gray-600 text-center mb-6">{errorMessage}</p>
              <div className="flex justify-center">
                <button
                  onClick={closeErrorPopup}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30"
      >
        <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-md">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              className={`w-full px-4 py-3 bg-white/20 text-white placeholder-white/80 rounded-xl outline-none focus:ring-2 focus:ring-white transition-all ${
                emailError ? "border-2 border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            {emailError && (
              <p className="text-red-400 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 bg-white/20 text-white placeholder-white/80 rounded-xl outline-none focus:ring-2 focus:ring-white transition-all ${
                passwordError ? "border-2 border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            {passwordError && (
              <p className="text-red-400 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-white/80 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white font-semibold underline hover:text-white/90 transition"
            >
              Create Account
            </Link>
          </p>
          <Link
            to="/forgetpassword"
            className="text-sm text-white underline hover:text-white/90 transition"
          >
            Forgot Password?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginForm;