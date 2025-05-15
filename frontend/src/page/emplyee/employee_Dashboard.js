import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js library
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Tag } from "antd";
import Sidebar from "../../components/sidebar/user_sidebar";

AOS.init({
  duration: 1500, // Slightly reduced for smoother animations
});

function Employeedashboard() {
  const [users, setUsers] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});
  const [data, setData] = useState(null);
  const [approveleaves, setapproveleaves] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/leaves/statuscounts")
      .then((response) => {
        setStatusCounts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching status counts:", error);
        setLoading(false);
      });
  }, []);

  //get all leaves
  const allleaves = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        "http://localhost:5000/api/leaves/getallleaves"
      );
      setapproveleaves(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    allleaves();
  }, []);

  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/users/getallusers"
      );
      setUsers(response.data);
      setLoading(false);
      // Calculate role counts
      const counts = response.data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      setRoleCounts(counts);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (roleCounts && Object.keys(roleCounts).length > 0) {
      setData({
        labels: Object.keys(roleCounts),
        datasets: [
          {
            data: Object.values(roleCounts),
            backgroundColor: [
              "#047857", // emerald-700
              "#065f46", // emerald-800
              "#059669", // emerald-600
              "#10b981", // emerald-500
              "#34d399", // emerald-400
              "#6ee7b7", // emerald-300
              "#a7f3d0", // emerald-200
              "#d1fae5", // emerald-100
            ],
            borderWidth: 0,
          },
        ],
      });
    }
  }, [roleCounts]);

  // Status colors for different leave types
  const statusColors = {
    pending: "#f59e0b",    // amber-500
    approved: "#10b981",   // emerald-500
    disapproved: "#ef4444" // red-500
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="w-full">
            {/* Header */}
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 text-center">
                Employee Leaves Dashboard
              </h1>
              <p className="text-gray-500 text-center mt-1">
                Monitor leave requests and employee distribution
              </p>
            </header>

            {/* Leave Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Pending Card */}
              <div 
                className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="bg-amber-50 px-4 py-2 border-b border-amber-100">
                  <h2 className="text-amber-800 font-medium">Pending Leaves</h2>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <div style={{ width: 100, height: 100 }} className="mb-3">
                    <CircularProgressbar
                      value={statusCounts.pending?.percentage || 0}
                      text={`${statusCounts.pending?.percentage || 0}%`}
                      styles={buildStyles({
                        pathColor: statusColors.pending,
                        textColor: statusColors.pending,
                        trailColor: "#fef3c7",
                      })}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Requests</p>
                    <p className="text-lg font-bold text-gray-800">
                      {statusCounts.pending?.count || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Approved Card */}
              <div 
                className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100">
                  <h2 className="text-emerald-800 font-medium">Approved Leaves</h2>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <div style={{ width: 100, height: 100 }} className="mb-3">
                    <CircularProgressbar
                      value={statusCounts.approved?.percentage || 0}
                      text={`${statusCounts.approved?.percentage || 0}%`}
                      styles={buildStyles({
                        pathColor: statusColors.approved,
                        textColor: statusColors.approved,
                        trailColor: "#d1fae5",
                      })}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Requests</p>
                    <p className="text-lg font-bold text-gray-800">
                      {statusCounts.approved?.count || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disapproved Card */}
              <div 
                className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="bg-red-50 px-4 py-2 border-b border-red-100">
                  <h2 className="text-red-800 font-medium">Disapproved Leaves</h2>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <div style={{ width: 100, height: 100 }} className="mb-3">
                    <CircularProgressbar
                      value={statusCounts.disapproved?.percentage || 0}
                      text={`${statusCounts.disapproved?.percentage || 0}%`}
                      styles={buildStyles({
                        pathColor: statusColors.disapproved,
                        textColor: statusColors.disapproved,
                        trailColor: "#fee2e2",
                      })}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Requests</p>
                    <p className="text-lg font-bold text-gray-800">
                      {statusCounts.disapproved?.count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Total Leaves */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg shadow-sm p-4 text-white">
                <h3 className="font-medium mb-1">Total Leaves</h3>
                <p className="text-2xl font-bold">
                  {(statusCounts.pending?.count || 0) + 
                   (statusCounts.approved?.count || 0) + 
                   (statusCounts.disapproved?.count || 0)}
                </p>
              </div>
              
              {/* Approval Rate */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg shadow-sm p-4 text-white">
                <h3 className="font-medium mb-1">Approval Rate</h3>
                <p className="text-2xl font-bold">
                  {statusCounts.approved?.count && statusCounts.disapproved?.count ? 
                    Math.round((statusCounts.approved.count / (statusCounts.approved.count + statusCounts.disapproved.count)) * 100) :
                    0}%
                </p>
              </div>
              
              {/* Pending Rate */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-4 text-white">
                <h3 className="font-medium mb-1">Pending Rate</h3>
                <p className="text-2xl font-bold">
                  {statusCounts.pending?.percentage || 0}%
                </p>
              </div>
            </div>

            {/* User Role Distribution */}
            <div 
              className="bg-white rounded-lg shadow-sm p-5 mb-6"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
                User Role Distribution
              </h2>
              
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Pie Chart */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  {data && <Pie data={data} options={{ 
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }} />}
                </div>
                
                {/* Role Legend */}
                <div className="w-full lg:w-1/2">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(roleCounts).map(([role, count], index) => (
                      <div key={role} className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ 
                            backgroundColor: [
                              "#047857", "#065f46", "#059669", "#10b981", 
                              "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"
                            ][index % 8] 
                          }}
                        ></div>
                        <div className="flex flex-1 justify-between">
                          <span className="font-medium capitalize">{role}</span>
                          <span className="font-semibold text-gray-700">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="mt-4 bg-emerald-50 p-3 rounded">
                    <div className="flex justify-between">
                      <span className="text-emerald-800 font-medium">Total Users</span>
                      <span className="font-bold text-emerald-900">{users.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Employeedashboard;