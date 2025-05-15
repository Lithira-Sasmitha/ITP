import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from "sweetalert2";
import backgroundImage from '../../components/login/background.jpg';

AOS.init({
  duration: 1000,
});

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/resetpassword/forgot-password', { email });
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.status,
      });
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User with this email does not exist',
        });
      } else {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to send reset password link',
        });
      }
    }
  };

  return (
    <div>
      <div
        data-aos="zoom-in"
        className="flex flex-col justify-center items-center bg-cover bg-center min-h-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {/* Sign Up Button */}
        <Link to="/signup" className="absolute top-0 right-5 m-6">
          <button className="text-white text-base font-semibold border border-solid border-transparent">
            Sign Up
          </button>
        </Link>
        
        <div className="w-full max-w-md px-6">
          <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Forgot Password</h1>
              <p className="text-gray-300 text-sm">Enter your email to receive a reset link</p>
            </div>

            {/* Avatar icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-1 w-24 h-24 flex items-center justify-center">
                <div className="bg-red-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  className="w-full px-5 py-4 bg-gray-600 bg-opacity-50 text-white placeholder-gray-300 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => { setEmail(e.target.value) }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-4 mt-2 text-md text-white bg-gray-800 border border-gray-700 rounded-lg tracking-wider transition duration-300 ease-in-out transform hover:bg-gray-700"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="mt-6 text-center">
                <Link to="/signin" className="text-gray-300 hover:text-white text-sm">
                  Remember your password? Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;