import React, { useState } from "react";
import Machinesidebar from "../../components/sidebar/Machinesidebar";

const MachineMaintenance = () => {
  const [formValues, setFormValues] = useState({
    machineName: "",
    machineId: "",
    issue: "",
    warranty: "no",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const handleWarrantyChange = (e) => {
    setFormValues({
      ...formValues,
      warranty: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.machineName)
      newErrors.machineName = "Machine Name is required.";
    else if (formValues.machineName.length < 3)
      newErrors.machineName = "Machine Name must be at least 3 characters.";

    if (!formValues.machineId) newErrors.machineId = "Machine ID is required.";
    else if (!/^[a-zA-Z0-9-]+$/.test(formValues.machineId))
      newErrors.machineId =
        "Machine ID must contain only letters, numbers, or hyphens.";

    if (!formValues.issue) newErrors.issue = "Issue description is required.";
    else if (formValues.issue.length < 10)
      newErrors.issue = "Issue description must be at least 10 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendEmail = async () => {
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors in the form." });
      return;
    }

    try {
      if (formValues.warranty === "yes") {
        // Simulate email sending (replace with actual API call in production)
        setMessage({
          type: "success",
          text: "Automated email sent to company!",
        });
        // Example: await sendEmailToCompany(formValues);
      } else {
        setMessage({ type: "info", text: "Machine is not under warranty." });
      }
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to send email. Try again later.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* this show  down Sidebar */}
      <div className="fixed h-screen w-64 flex-shrink-0">
        <Machinesidebar />
      </div>

      {/* This is Main Content */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-screen">
          {/*This is a  Header */}
          <header className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-black-900">
              Machine Maintenance
            </h1>
            <p className="text-gray-600 mt-2">
              Report machine issues and request support
            </p>
          </header>

          {/* This is a Form Section */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Report Maintenance Issue
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine Name *
                </label>
                <input
                  type="text"
                  name="machineName"
                  value={formValues.machineName}
                  onChange={handleInputChange}
                  placeholder="Enter machine name"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.machineName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.machineName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machineName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine ID *
                </label>
                <input
                  type="text"
                  name="machineId"
                  value={formValues.machineId}
                  onChange={handleInputChange}
                  placeholder="Enter machine ID"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.machineId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.machineId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machineId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Description *
                </label>
                <textarea
                  name="issue"
                  value={formValues.issue}
                  onChange={handleInputChange}
                  placeholder="Describe the machine issue"
                  rows="4"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.issue ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.issue && (
                  <p className="text-red-500 text-sm mt-1">{errors.issue}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Is the machine under warranty?
                </label>
                <div className="flex items-center space-x-6 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="warranty"
                      value="yes"
                      checked={formValues.warranty === "yes"}
                      onChange={handleWarrantyChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="warranty"
                      value="no"
                      checked={formValues.warranty === "no"}
                      onChange={handleWarrantyChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  Send Email to Company
                </button>
              </div>
            </form>
          </section>

          {/* Message */}
          {message.text && (
            <div
              className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${
                message.type === "success"
                  ? "bg-green-500 text-white"
                  : message.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-yellow-500 text-white"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MachineMaintenance;
