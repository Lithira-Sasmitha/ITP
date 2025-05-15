import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Userupdate = () => {
  const { userid } = useParams();

  const [id, setid] = useState("");
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/getuser/${userid}`);
        console.log(response); // This helps debug the response structure
        
        // Fixed to correctly access the user data from the response
        const userData = response.data;
        
        // Check if the user data is nested inside a 'user' property or directly in data
        const user = userData.user || userData;
        
        setid(user._id);
        setfullName(user.fullName);
        setemail(user.email);
        setphone(user.phone);
        setRole(user.role);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch user data");
        setLoading(false);
      }
    }
    
    getUser();
  }, [userid]);

  async function Updateuser(e) {
    e.preventDefault();

    const updateuser = {
      fullName,
      email,
      phone,
      role,
    };

    try {
      await axios.put(
        `http://localhost:5000/api/users/updateuser/${userid}`,
        updateuser
      );

      Swal.fire("Congratulations", "User updated successfully", "success").then(
        () => {
          window.location.href = "/allusers";
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center">
        <div 
          data-aos="zoom-in" 
          className="w-full max-w-2xl bg-white shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 py-6 px-8 rounded-t-3xl">
            <h1 className="text-3xl font-bold text-white tracking-wide flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Update User Profile
            </h1>
            <div className="w-24 h-1 bg-white/70 rounded-full mx-auto mt-3"></div>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={Updateuser} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">User ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={id}
                    readOnly
                    required
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 py-3 pl-12 pr-4 text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Full name input */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setfullName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter user's full name"
                  />
                </div>
              </div>

              {/* Email input */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Phone input */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                    minLength={10}
                    maxLength={10}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
              </div>

              {/* Role select */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <select
                    value={role}
                    onChange={handleRoleChange}
                    required
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-10 text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors duration-200"
                  >
                    <option value="User">User</option>
                    <option value="Employee manager">Employee manager</option>
                    <option value="Financial manager">Financial manager</option>
                    <option value="Order manager">Order manager</option>
                    <option value="Inventory manager">Inventory manager</option>
                    <option value="Machine manager">Machine manager</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                >
                  Update User Information
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userupdate;