// import { useState, useEffect } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import { FaUser, FaBook, FaChartBar, FaEnvelope, FaCog, FaSignOutAlt } from "react-icons/fa";
// import logo from "../../assets/logo.png";

// function income() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-150">
//       {/* Sidebar */}
//       <div className="w-64 bg-green-900 text-white p-5 flex flex-col justify-between shadow-lg">
//         <div>
//           <div className="flex justify-center mb-6">
//             <img src={logo} alt="Logo" className="w-16 h-16 rounded-full" />
//           </div>
//           <nav>
//             <ul>
//               <li className="mb-4">
//                 <button onClick={() => navigate("/Layout")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
//                   <FaChartBar className="mr-4" /> Dashboard
//                 </button>
//               </li>
//               <li className="mb-4">
//                 <button onClick={() => navigate("/income")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
//                   <FaBook className="mr-4" /> Income
//                 </button>
//               </li>
//               <li className="mb-4">
//                 <button onClick={() => navigate("/profile")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
//                   <FaUser className="mr-4" /> Expences
//                 </button>
//               </li>
//               <li className="mb-4">
//                 <button onClick={() => navigate("/settings")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
//                   <FaCog className="mr-4" /> Salary
//                 </button>
//               </li>
//               <li className="mb-4">
//                 <button onClick={() => navigate("/Payment")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
//                   <FaCog className="mr-4" /> Payment
//                 </button>
//               </li>
//               <li className="mb-4">
//                 <button onClick={() => navigate("/Chat")} className="flex items-center w-full p-3 rounded-lg hover:bg-green-700">
//                   <FaCog className="mr-4" /> Chat
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => navigate("/logout")} className="flex items-center w-full p-3 rounded-lg bg-red-600 hover:bg-red-500">
//                   <FaSignOutAlt className="mr-4" /> Logout
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//         <div className="text-sm text-gray-400">
//           <div className="flex items-center mb-2">
//             <FaEnvelope className="mr-2" /> info@example.com
//           </div>
//           <div>{currentTime.toLocaleTimeString()}</div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow p-8  ">
//         <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
//         <div className="grid grid-cols-3 gap-4">
//           <div className="p-6 bg-white shadow-lg rounded-lg text-center">
//             <h2 className="text-lg font-semibold">Web Development</h2>
//           </div>
//           <div className="p-6 bg-white shadow-lg rounded-lg text-center">
//             <h2 className="text-lg font-semibold">App Development</h2>
//           </div>
//           <div className="p-6 bg-white shadow-lg rounded-lg text-center">
//             <h2 className="text-lg font-semibold">UX & UI</h2>
//           </div>
//         </div>
        
//         {/* Profile Section */}
//         <div className="mt-8 bg-white p-6 shadow-lg rounded-lg">
//           <div className="flex items-center mb-4">
//             <img src="https://via.placeholder.com/50" alt="Profile" className="w-16 h-16 rounded-full mr-4" />
//             <div>
//               <h3 className="text-lg font-semibold">Jhonne Doe</h3>
//               <p className="text-gray-500">Teacher</p>
//             </div>
//           </div>
//           <ul>
//             <li className="p-3 bg-gray-100 rounded-lg mb-2">HTML & CSS - 2 Hours</li>
//             <li className="p-3 bg-gray-100 rounded-lg mb-2">JavaScript - 2 Hours</li>
//             <li className="p-3 bg-gray-100 rounded-lg mb-2">React.js - 2 Hours</li>
//             <li className="p-3 bg-gray-100 rounded-lg mb-2">Node.js - 2 Hours</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default income;