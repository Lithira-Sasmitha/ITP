import React from 'react';

const Index = () => {
  return (
    <div className="flex w-full h-screen">
      
      {/* Left Side - Login Form */}
      <div className="w-full flex items-center justify-center lg:w-1/2 px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-center">Please enter your details to login.</p>

          {/* Form */}
          <div className="mt-6 space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your email"
                type="email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your password"
                type="password"
              />
            </div>

            {/* Login Button */}
            <div className="mt-4">
              <button className="w-full bg-violet-500 text-white py-2 rounded-lg hover:bg-violet-600 transition font-semibold">
                Login
              </button>
            </div>

            {/* Create New Account Button */}
            <div className="mt-2 text-center">
              <p className="text-gray-600">Don't have an account?</p>
              <button className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-semibold">
                Create New Account
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Right Side - Decoration */}
      <div className="hidden lg:flex relative h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-spin" />
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
      </div>

    </div>
  );
};

export default Index;
