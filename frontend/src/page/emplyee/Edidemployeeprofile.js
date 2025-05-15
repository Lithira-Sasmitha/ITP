import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaUser, FaEnvelope, FaPhone, FaSave, FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import ProfileSidebar from "../../components/sidebar/emplyee_profilesidebar";

AOS.init({
  duration: 800,
});

const EditEmployeeProfile = () => {
  const [userData, setUserData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    imageurl: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("currentuser");
    if (userDataString) {
      const userDataLocal = JSON.parse(userDataString);
      setUserData((prevState) => ({
        ...prevState,
        id: userDataLocal._id,
        fullName: userDataLocal.fullName || "",
        email: userDataLocal.email || "",
        phone: userDataLocal.phone || "",
        imageurl: userDataLocal.imageurl || "https://via.placeholder.com/150",
        password: userDataLocal.password || "",
      }));
      fetchUserData(userDataLocal._id); // fetch latest from server too
    } else {
      console.log("No user data found in localStorage.");
    }
  }, []);
  

  const fetchUserData = async (userID) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/users/getuser", { userID });
      const user = response.data.user;
      setUserData({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        imageurl: user.imageurl || "https://via.placeholder.com/150",
        password: user.password,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user data:", error);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/users/updateuser/${userData.id}`, userData);
      setLoading(false);
      Swal.fire({
        title: "Profile Updated",
        text: "Your information has been successfully updated",
        icon: "success",
        confirmButtonColor: "#2563EB",
        confirmButtonText: "Continue"
      }).then(() => {
        window.location.href = `/e_userprofile`;
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Update Failed",
        text: "There was an error updating your profile",
        icon: "error",
        confirmButtonColor: "#DC2626"
      });
      console.error("Error updating user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 fixed top-0 left-0 h-full shadow-lg z-10">
        <ProfileSidebar />
      </div>

      {/* Main Content */}
      <div className="w-3/4 ml-auto overflow-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-6" data-aos="fade-right">
            <a href="/employeeProfileDashboard" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
              <FaArrowLeft className="mr-2" />
              <span>Back to Profile</span>
            </a>
          </div>
          
          {/* Page title */}
          <div className="mb-8" data-aos="fade-up">
            <h1 className="text-3xl font-bold text-gray-800">Edit Profile Information</h1>
            <p className="text-gray-600 mt-2">Update your personal details and contact information</p>
          </div>

          {/* Main card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="100">
            {loading ? (
              <div className="flex justify-center items-center p-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="md:flex">
                {/* Left column - Photo */}
                <div className="bg-blue-50 md:w-1/3 p-8 flex flex-col items-center justify-center border-r border-gray-200">
                  <div className="relative mb-4">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <img
                        className="object-cover w-full h-full"
                        src={userData.imageurl}
                        alt="Profile"
                      />
                    </div>
                    <label 
                      htmlFor="file-upload" 
                      className="absolute bottom-2 right-2 bg-white hover:bg-blue-50 text-blue-600 p-2 rounded-full cursor-pointer shadow border border-gray-200 transition-all duration-300"
                    >
                      <FaPencilAlt className="h-4 w-4" />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        // Handle image upload logic here
                      }}
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{userData.fullName}</h2>
                  <p className="text-gray-500 text-sm mt-1">{userData.email}</p>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                  <b className="text-xl font-semibold text-green-500">{userData.fullName} </b> wellcome ! Your Profile
                  </p>
                </div>

                {/* Right column - Form */}
                <div className="md:w-2/3 p-8">
                  <form onSubmit={updateUser} className="space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            value={userData.fullName}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={userData.email}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            maxLength={10}
                            value={userData.phone}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a 10-digit phone number without spaces or dashes
                        </p>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-gray-200">
                      <div className="flex justify-end">
                        <a
                          href="/e_userprofile"
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
                        >
                          Cancel
                        </a>
                        <button
                          type="submit"
                          className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaSave className="mr-2 h-4 w-4" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Information card */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-4 text-sm text-gray-500" data-aos="fade-up" data-aos-delay="200">
            <p className="flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              Any changes made will be reflected immediately across all company systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeProfile;