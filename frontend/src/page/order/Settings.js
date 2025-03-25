import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaClock,
  FaTruck,
  FaBell,
  FaClipboardList,
} from "react-icons/fa";

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: "Jayasinghe Storelines",
    timeZone: "GMT+5:30",
    operatingHours: {
      start: "09:00",
      end: "18:00",
    },
    deliveryFee: 5.0,
    maxDeliveriesPerDay: 100,
    notificationPreferences: {
      sms: true,
      email: true,
    },
    orderManagement: {
      orderConfirmation: true,
      deliveryUpdates: true,
      estimatedDeliveryTime: 30, // in minutes
    },
  });

  const [gradientDegree, setGradientDegree] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientDegree((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOrderManagementChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      orderManagement: {
        ...prev.orderManagement,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    alert("Settings saved!");
  };

  return (
    <div
      className="min-h-screen p-8 flex justify-center items-start"
      style={{
        background: `linear-gradient(${gradientDegree}deg, #4158D0, #C850C0, #FFCC70)`,
      }}
    >
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gray-800 text-white p-6">
          <h1 className="text-4xl font-bold text-center">Settings</h1>
        </div>

        <div className="p-8 space-y-8">
          {/* General Settings */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FaClock className="mr-2" /> General Settings
            </h2>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Time Zone
              </label>
              <select
                name="timeZone"
                value={settings.timeZone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="GMT-5:00">GMT-5:00</option>
                <option value="GMT+1:00">GMT+1:00</option>
                <option value="GMT+5:30">GMT+5:30</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Operating Hours
              </label>
              <div className="flex space-x-4">
                <input
                  type="time"
                  name="start"
                  value={settings.operatingHours.start}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      operatingHours: {
                        ...prev.operatingHours,
                        start: e.target.value,
                      },
                    }))
                  }
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <input
                  type="time"
                  name="end"
                  value={settings.operatingHours.end}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      operatingHours: {
                        ...prev.operatingHours,
                        end: e.target.value,
                      },
                    }))
                  }
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FaTruck className="mr-2" /> Delivery Settings
            </h2>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                name="deliveryFee"
                value={settings.deliveryFee}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Max Deliveries Per Day
              </label>
              <input
                type="number"
                name="maxDeliveriesPerDay"
                value={settings.maxDeliveriesPerDay}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FaBell className="mr-2" /> Notification Settings
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sms"
                name="sms"
                checked={settings.notificationPreferences.sms}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      sms: e.target.checked,
                    },
                  }))
                }
                className="h-5 w-5 text-blue-600 focus:ring-blue-400 transition"
              />
              <label htmlFor="sms" className="text-gray-700 font-medium">
                Notify by SMS
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="email"
                name="email"
                checked={settings.notificationPreferences.email}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      email: e.target.checked,
                    },
                  }))
                }
                className="h-5 w-5 text-blue-600 focus:ring-blue-400 transition"
              />
              <label htmlFor="email" className="text-gray-700 font-medium">
                Notify by Email
              </label>
            </div>
          </div>

          {/* Order Management Settings */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FaClipboardList className="mr-2" /> Order Management Settings
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="orderConfirmation"
                name="orderConfirmation"
                checked={settings.orderManagement.orderConfirmation}
                onChange={handleOrderManagementChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-400 transition"
              />
              <label
                htmlFor="orderConfirmation"
                className="text-gray-700 font-medium"
              >
                Send Order Confirmation
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deliveryUpdates"
                name="deliveryUpdates"
                checked={settings.orderManagement.deliveryUpdates}
                onChange={handleOrderManagementChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-400 transition"
              />
              <label
                htmlFor="deliveryUpdates"
                className="text-gray-700 font-medium"
              >
                Send Delivery Updates
              </label>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Estimated Delivery Time (minutes)
              </label>
              <input
                type="number"
                name="estimatedDeliveryTime"
                value={settings.orderManagement.estimatedDeliveryTime}
                onChange={handleOrderManagementChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-gray-100 px-8 py-4">
          <button
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 flex items-center justify-center"
            onClick={handleSave}
          >
            <FaSave className="mr-2" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
