import React, { useState, useEffect } from "react";
import { useGetMachinesQuery } from "../../page/machine/redux/api/machineapiSlice";
import { useGetPartsQuery } from "../../page/machine/redux/api/machinepartapiSlice";
import axios from "axios";
import Machinesidebar from "../../components/sidebar/Machinesidebar";

const API_BASE_URL = "http://localhost:5000/api";

const MachineMaintenance = () => {
  // State for form values
  const [formValues, setFormValues] = useState({
    machineId: "",
    partId: "",
    issue: "",
    statusInquiryId: "",
    maintenanceStatus: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // State for feedback messages
  const [message, setMessage] = useState({ type: "", text: "" });

  // State to store submitted maintenance inquiries
  const [maintenanceInquiries, setMaintenanceInquiries] = useState([]);

  // State to track if current machine and part are under warranty
  const [isUnderWarranty, setIsUnderWarranty] = useState(false);

  // State to store filtered parts for the selected machine
  const [filteredParts, setFilteredParts] = useState([]);

  // Fetch machines and parts using RTK Query
  const {
    data: machinesData,
    isLoading: machinesLoading,
    error: machinesError,
  } = useGetMachinesQuery();
  const {
    data: partsData,
    isLoading: partsLoading,
    error: partsError,
  } = useGetPartsQuery();

  // Ensure machines and parts are arrays
  const machines = Array.isArray(machinesData?.data) ? machinesData.data : [];
  const allParts = Array.isArray(partsData) ? partsData : [];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Filter parts when machine is selected
    if (name === "machineId" && value) {
      const selectedMachine = machines.find((machine) => machine._id === value);
      if (selectedMachine) {
        const machineParts = allParts.filter(
          (part) => part.machineId === value
        );
        setFilteredParts(machineParts);
        setFormValues((prev) => ({ ...prev, partId: "" }));
      }
    } else if (name === "machineId" && !value) {
      setFilteredParts([]);
      setFormValues((prev) => ({ ...prev, partId: "" }));
    }
  };

  // Validate ObjectId format
  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Validate form inputs for reporting issue
  const validateForm = () => {
    const newErrors = {};

    if (!formValues.machineId) {
      newErrors.machineId = "Machine ID is required.";
    } else if (!isValidObjectId(formValues.machineId)) {
      newErrors.machineId =
        "Machine ID must be a valid ObjectId (24 hexadecimal characters).";
    }

    if (!formValues.partId) {
      newErrors.partId = "Part ID is required.";
    } else if (!isValidObjectId(formValues.partId)) {
      newErrors.partId =
        "Part ID must be a valid ObjectId (24 hexadecimal characters).";
    }

    if (!formValues.issue) {
      newErrors.issue = "Issue description is required.";
    } else if (formValues.issue.length < 10) {
      newErrors.issue = "Issue description must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if machine and part are under warranty
  const checkWarrantyStatus = async (machineId, partId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/maintenance/check-warranty/${machineId}/${partId}`
      );
      const data = response.data;

      if (!data.success) {
        setMessage({
          type: "error",
          text: data.message || "Error checking warranty status",
        });
        return false;
      }

      const isUnderWarranty =
        data.machineUnderWarranty && data.partUnderWarranty;
      setIsUnderWarranty(isUnderWarranty);

      if (!data.machineUnderWarranty) {
        setMessage({
          type: "warning",
          text: "Machine is not under warranty",
        });
      } else if (!data.partUnderWarranty) {
        setMessage({
          type: "warning",
          text: "Part is not under warranty",
        });
      }

      return isUnderWarranty;
    } catch (error) {
      console.error(
        "Error checking warranty status:",
        error.response?.data || error.message
      );
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to check warranty status. Please try again.",
      });
      return false;
    }
  };

  // Fetch maintenance inquiries
  const fetchMaintenanceInquiries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/maintenance`);
      const data = response.data;

      if (data.success) {
        setMaintenanceInquiries(data.data);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to fetch maintenance inquiries",
        });
      }
    } catch (error) {
      console.error(
        "Error fetching maintenance inquiries:",
        error.response?.data || error.message
      );
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          `Failed to fetch maintenance inquiries: ${error.message}`,
      });
    }
  };

  // Load maintenance inquiries on component mount
  useEffect(() => {
    fetchMaintenanceInquiries();
  }, []);

  // Handle errors from RTK Query
  useEffect(() => {
    if (machinesError) {
      setMessage({
        type: "error",
        text: machinesError.data?.message || "Failed to fetch machines",
      });
    }
    if (partsError) {
      setMessage({
        type: "error",
        text: partsError.data?.message || "Failed to fetch parts",
      });
    }
  }, [machinesError, partsError]);

  // Submit the maintenance inquiry
  const handleSubmitRequest = async () => {
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors in the form." });
      return;
    }

    try {
      const isWarrantyValid = await checkWarrantyStatus(
        formValues.machineId,
        formValues.partId
      );

      const response = await axios.post(`${API_BASE_URL}/maintenance`, {
        machineId: formValues.machineId,
        partId: formValues.partId,
        issue: formValues.issue,
        isUnderWarranty: isWarrantyValid,
      });

      const data = response.data;

      if (!data.success) {
        setMessage({
          type: "error",
          text: data.message || "Failed to submit maintenance inquiry",
        });
        return;
      }

      // Reset the form
      setFormValues({
        machineId: "",
        partId: "",
        issue: "",
        statusInquiryId: "",
        maintenanceStatus: "",
      });
      setFilteredParts([]);
      setIsUnderWarranty(false);

      // Refresh the maintenance inquiries list
      await fetchMaintenanceInquiries();

      setMessage({
        type: "success",
        text: isWarrantyValid
          ? "Maintenance inquiry submitted successfully! Both machine and part are under warranty."
          : "Maintenance inquiry submitted successfully! Note: Not all items are under warranty.",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(
        "Error submitting maintenance inquiry:",
        error.response?.data || error.message
      );
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          `Failed to submit maintenance inquiry: ${error.message}`,
      });
    }
  };

  // Send email to company by opening Gmail compose window
  const handleSendEmail = (inquiry) => {
    const companyEmail = "support@company.com";
    const subject = encodeURIComponent(`Maintenance Inquiry ${inquiry._id}`);
    const body = encodeURIComponent(
      `Dear Support Team,\n\n` +
        `I am contacting you regarding a maintenance issue with the following details:\n` +
        `Inquiry ID: ${inquiry._id}\n` +
        `Machine: ${inquiry.machineId?.name || "Unknown Machine"} (ID: ${
          inquiry.machineId?.id || inquiry.machineId
        })\n` +
        `Part: ${inquiry.partId?.machinepartName || "Unknown Part"} (ID: ${
          inquiry.partId?.machinepartId || inquiry.partId
        })\n` +
        `Issue: ${inquiry.issue}\n\n` +
        `This item is under warranty. Please advise on the next steps.\n\n` +
        `Best regards,\n[Your Name]`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${companyEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  // Delete a maintenance inquiry
  const handleDeleteRequest = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/maintenance/${id}`);
      const data = response.data;

      if (!data.success) {
        setMessage({
          type: "error",
          text: data.message || "Failed to delete maintenance inquiry",
        });
        return;
      }

      await fetchMaintenanceInquiries();

      setMessage({
        type: "success",
        text: "Inquiry deleted successfully!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(
        "Error deleting maintenance inquiry:",
        error.response?.data || error.message
      );
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          `Failed to delete maintenance inquiry: ${error.message}`,
      });
    }
  };

  // Update maintenance status
  const handleUpdateStatus = async () => {
    try {
      const { statusInquiryId, maintenanceStatus } = formValues;

      // Validate inputs
      if (!statusInquiryId) {
        setMessage({
          type: "error",
          text: "Please select a maintenance inquiry",
        });
        return;
      }

      if (!maintenanceStatus) {
        setMessage({
          type: "error",
          text: "Please select a status",
        });
        return;
      }

      // Validate ObjectId
      if (!isValidObjectId(statusInquiryId)) {
        setMessage({
          type: "error",
          text: "Invalid Maintenance Inquiry ID",
        });
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/maintenance/${statusInquiryId}`,
        {
          status: maintenanceStatus,
        }
      );

      const data = response.data;

      if (!data.success) {
        setMessage({
          type: "error",
          text: data.message || "Failed to update maintenance status",
        });
        return;
      }

      // Reset the form
      setFormValues((prev) => ({
        ...prev,
        statusInquiryId: "",
        maintenanceStatus: "",
      }));

      // Refresh the maintenance inquiries list
      await fetchMaintenanceInquiries();

      setMessage({
        type: "success",
        text: "Maintenance status updated successfully!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(
        "Error updating maintenance status:",
        error.response?.data || error.message
      );
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update maintenance status. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="fixed h-screen w-64 flex-shrink-0">
        <Machinesidebar />
      </div>

      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-screen">
          <header className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-black-900">
              Machine Maintenance
            </h1>
            <p className="text-gray-600 mt-2">
              Report machine issues and request support
            </p>
          </header>

          <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Report Maintenance Issue
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Machine *
                </label>
                <select
                  name="machineId"
                  value={formValues.machineId}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.machineId ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={machinesLoading}
                >
                  <option value="">Select a machine</option>
                  {machines.map((machine) => (
                    <option key={machine._id} value={machine._id}>
                      {machine.name} (ID: {machine.id})
                    </option>
                  ))}
                </select>
                {errors.machineId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machineId}
                  </p>
                )}
                {machinesLoading && (
                  <p className="text-gray-500 text-sm mt-1">
                    Loading machines...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Part *
                </label>
                <select
                  name="partId"
                  value={formValues.partId}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.partId ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={partsLoading || !formValues.machineId}
                >
                  <option value="">Select a part</option>
                  {filteredParts.map((part) => (
                    <option key={part._id} value={part._id}>
                      {part.machinepartName} (ID: {part.machinepartId})
                    </option>
                  ))}
                </select>
                {errors.partId && (
                  <p className="text-red-500 text-sm mt-1">{errors.partId}</p>
                )}
                {partsLoading && (
                  <p className="text-gray-500 text-sm mt-1">Loading parts...</p>
                )}
                {!formValues.machineId && !partsLoading && (
                  <p className="text-gray-500 text-sm mt-1">
                    Select a machine to view its parts
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Update Maintenance Status
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Inquiry *
                </label>
                <select
                  name="statusInquiryId"
                  value={formValues.statusInquiryId}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all border-gray-300"
                >
                  <option value="">Select Inquiry</option>
                  {maintenanceInquiries.map((inquiry) => (
                    <option key={inquiry._id} value={inquiry._id}>
                      {inquiry.machineId?.name || "Unknown Machine"} -{" "}
                      {inquiry.partId?.machinepartName || "Unknown Part"} (
                      {inquiry.issue.substring(0, 20)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Status *
                </label>
                <select
                  name="maintenanceStatus"
                  value={formValues.maintenanceStatus}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all border-gray-300"
                >
                  <option value="">Select Status</option>
                  <option value="inprogress">In Progress</option>
                  <option value="complete">Complete</option>
                  <option value="reject">Reject</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  Update Status
                </button>
              </div>
            </form>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Maintenance Inquiries
            </h2>

            {maintenanceInquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Machine Name
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Machine ID
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Part Name
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Part ID
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Issue
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Warranty Status
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Date Submitted
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceInquiries.map((inquiry) => (
                      <tr
                        key={inquiry._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-200 px-4 py-2">
                          {inquiry.machineId?.name || "Unknown Machine"}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {inquiry.machineId?.id || inquiry.machineId}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {inquiry.partId?.machinepartName || "Unknown Part"}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {inquiry.partId?.machinepartId || inquiry.partId}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {inquiry.issue.length > 50
                            ? `${inquiry.issue.substring(0, 50)}...`
                            : inquiry.issue}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {inquiry.isUnderWarranty
                            ? "Under Warranty"
                            : "Not Under Warranty"}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              inquiry.status === "complete"
                                ? "bg-green-100 text-green-800"
                                : inquiry.status === "inprogress"
                                ? "bg-yellow-100 text-yellow-800"
                                : inquiry.status === "reject"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {inquiry.status.charAt(0).toUpperCase() +
                              inquiry.status.slice(1)}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {new Date(inquiry.dateSubmitted).toLocaleString()}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 flex space-x-2">
                          <button
                            onClick={() => handleDeleteRequest(inquiry._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                          {inquiry.isUnderWarranty && (
                            <button
                              onClick={() => handleSendEmail(inquiry)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
                            >
                              Send Email
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No maintenance inquiries submitted yet.
              </p>
            )}
          </section>

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
