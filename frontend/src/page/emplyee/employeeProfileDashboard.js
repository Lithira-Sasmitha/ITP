import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import ProfileSidebar from "../../components/sidebar/emplyee_profilesidebar";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function Employeeprofiledashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayMarkedIn, setTodayMarkedIn] = useState(false);
  const [todayMarkedOut, setTodayMarkedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("currentuser");
      if (!userStr) throw new Error("No user found in localStorage");
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error getting current user:", error);
      Swal.fire({
        title: "Session Error",
        text: "Your session appears to be invalid. Please log in again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return null;
    }
  };

  const user = getCurrentUser();
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      checkTodayAttendance(userId);
    }
  }, [userId]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const checkTodayAttendance = async (userId) => {
    if (!userId) return;
    try {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const inResponse = await axios.get(`http://localhost:5000/api/attendanceIn/checkStatus/${userId}?date=${formattedDate}`);
      setTodayMarkedIn(inResponse.data?.exists || false);

      const outResponse = await axios.get(`http://localhost:5000/api/attendanceOut/checkStatus/${userId}?date=${formattedDate}`);
      setTodayMarkedOut(outResponse.data?.exists || false);
    } catch (error) {
      console.error("Error checking today's attendance:", error);
      setTodayMarkedIn(false);
      setTodayMarkedOut(false);
    }
  };

  const handleMarkIn = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const formattedTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`;

      const checkResponse = await axios.get(`http://localhost:5000/api/attendanceIn/checkStatus/${userId}?date=${formattedDate}`);
      if (checkResponse.data?.exists) {
        setTodayMarkedIn(true);
        throw new Error("You have already checked in today.");
      }

      const response = await axios.post("http://localhost:5000/api/attendanceIn/mark_in", {
        userid: userId,
        intime: formattedTime,
        date: formattedDate,
      });

      if (response.status === 201 || response.status === 200) {
        setTodayMarkedIn(true);
        Swal.fire({
          title: "Checked In!",
          text: `You have successfully checked in at ${formattedTime}`,
          icon: "success",
          confirmButtonColor: "#38A169",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error marking in:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Unable to mark attendance. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkOut = async () => {
    if (!userId) return;
    if (!todayMarkedIn) {
      Swal.fire({
        title: "Warning!",
        text: "You need to check in before checking out.",
        icon: "warning",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }
    setLoading(true);
    try {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const formattedTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`;

      const checkResponse = await axios.get(`http://localhost:5000/api/attendanceOut/checkStatus/${userId}?date=${formattedDate}`);
      if (checkResponse.data?.exists) {
        setTodayMarkedOut(true);
        throw new Error("You have already checked out today.");
      }

      const response = await axios.post("http://localhost:5000/api/attendanceOut/mark_out", {
        userid: userId,
        outtime: formattedTime,
        date: formattedDate,
      });

      if (response.status === 201 || response.status === 200) {
        setTodayMarkedOut(true);
        Swal.fire({
          title: "Checked Out!",
          text: `You have successfully checked out at ${formattedTime}`,
          icon: "success",
          confirmButtonColor: "#38A169",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error marking out:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Unable to mark attendance. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-6">User information not found. Please log in again.</p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <ProfileSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Profile Board</h1>
          <p className="text-sm text-gray-600">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendar</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="border-0 shadow-none w-full"
              tileClassName="text-center"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Tracker</h2>
            <div className="flex flex-col items-center mb-4">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {formatTime(currentTime)}
              </div>
              <p className="text-sm text-gray-500">Sri Lankan Standard Time</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={handleMarkIn}
                disabled={todayMarkedIn || loading}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                  todayMarkedIn 
                    ? "bg-green-100 border-green-200" 
                    : loading 
                      ? "bg-gray-100 border-gray-200 cursor-wait" 
                      : "bg-white border-gray-200 hover:bg-green-50 hover:border-green-300"
                } transition-all duration-300`}
              >
                <div className="p-3 rounded-full bg-green-100 mb-2">
                  <FaSignInAlt className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium">
                  {loading && !todayMarkedIn ? "Processing..." : todayMarkedIn ? "Checked In" : "Check In"}
                </span>
              </button>

              <button
                onClick={handleMarkOut}
                disabled={!todayMarkedIn || todayMarkedOut || loading}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                  todayMarkedOut 
                    ? "bg-blue-100 border-blue-200" 
                    : !todayMarkedIn 
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed" 
                      : loading 
                        ? "bg-gray-100 border-gray-200 cursor-wait" 
                        : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                } transition-all duration-300`}
              >
                <div className={`p-3 rounded-full mb-2 ${todayMarkedOut || !todayMarkedIn ? "bg-blue-100" : "bg-blue-100"}`}>
                  <FaSignOutAlt className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium">
                  {loading && !todayMarkedOut && todayMarkedIn ? "Processing..." : todayMarkedOut ? "Checked Out" : "Check Out"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employeeprofiledashboard;