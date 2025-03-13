import React from 'react';

const Register = () => {
  return (
    <div className="flex w-full h-screen">
      
      {/* Left Side - Registration Form */}
      <div className="w-full flex flex-col items-center justify-center lg:w-1/2 px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Create Account</h1>
          <p className="text-gray-500 mt-2 text-center">Join us by entering your details.</p>

          {/* Form */}
          <div className="mt-6">
            
            {/* Full Name Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your name"
                type="text"
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your email"
                type="email"
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your password"
                type="password"
              />
            </div>

            {/* Re-enter Password Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Re-enter Password</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Re-enter your password"
                type="password"
              />
            </div>

            {/* Phone Number Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Phone Number</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your phone number"
                type="tel"
              />
            </div>

            {/* Category Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Category</label>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="">Select a category</option>
                <option value="financial_manager">Financial Manager</option>
                <option value="employee_manager">Employee Manager</option>
                <option value="inventory_manager">Inventory Manager</option>
                <option value="order_manager">Order Manager</option>
                <option value="machine_manager">Machine Manager</option>
              </select>
            </div>

            {/* Sign Up Button */}
            <div className="mt-6">
              <button className="w-full bg-violet-500 text-white py-2 rounded-lg hover:bg-violet-600 transition">
                Sign Up
              </button>
            </div>

            {/* Already Have an Account? */}
            <div className="mt-4 text-center">
              <p className="text-gray-600">Already have an account?</p>
              <button className="mt-2 text-violet-500 hover:underline">Log In</button>
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

export default Register;
