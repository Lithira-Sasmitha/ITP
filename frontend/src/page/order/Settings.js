import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaClock,
  FaTruck,
  FaBell,
  FaClipboardList,
} from "react-icons/fa";
import Oderslidebar from "../../components/sidebar/oderslidebar";

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
    alert("Settings saved!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Oderslidebar />

      {/* Main Content */}
      <div
        className="flex-1 p-6 overflow-y-auto"
        style={{
          background: `linear-gradient(${gradientDegree}deg, #4158D0, #C850C0, #FFCC70)`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-sm text-gray-200">
              Customize your store and delivery preferences
            </p>
          </div>

          {/* Settings Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
            {/* General Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center border-b pb-2 mb-4">
                <FaClock className="mr-2" /> General Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={settings.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <select
                    name="timeZone"
                    value={settings.timeZone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
                  >
                    <option value="GMT-5:00">GMT-5:00</option>
                    <option value="GMT+1:00">GMT+1:00</option>
                    <option value="GMT+5:30">GMT+5:30</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
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
                      className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center border-b pb-2 mb-4">
                <FaTruck className="mr-2" /> Delivery Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={settings.deliveryFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Deliveries Per Day
                  </label>
                  <input
                    type="number"
                    name="maxDeliveriesPerDay"
                    value={settings.maxDeliveriesPerDay}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center border-b pb-2 mb-4">
                <FaBell className="mr-2" /> Notification Settings
              </h2>
              <div className="space-y-4">
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
                    className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded transition duration-150"
                  />
                  <label
                    htmlFor="sms"
                    className="text-sm text-gray-700 font-medium"
                  >
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
                    className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded transition duration-150"
                  />
                  <label
                    htmlFor="email"
                    className="text-sm text-gray-700 font-medium"
                  >
                    Notify by Email
                  </label>
                </div>
              </div>
            </div>

            {/* Order Management Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center border-b pb-2 mb-4">
                <FaClipboardList className="mr-2" /> Order Management Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="orderConfirmation"
                    name="orderConfirmation"
                    checked={settings.orderManagement.orderConfirmation}
                    onChange={handleOrderManagementChange}
                    className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded transition duration-150"
                  />
                  <label
                    htmlFor="orderConfirmation"
                    className="text-sm text-gray-700 font-medium"
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
                    className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded transition duration-150"
                  />
                  <label
                    htmlFor="deliveryUpdates"
                    className="text-sm text-gray-700 font-medium"
                  >
                    Send Delivery Updates
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="estimatedDeliveryTime"
                    value={settings.orderManagement.estimatedDeliveryTime}
                    onChange={handleOrderManagementChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-sm font-medium transition duration-150 flex items-center"
              >
                <FaSave className="mr-2" /> Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
