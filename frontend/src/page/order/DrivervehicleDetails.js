import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useCreateDriverMutation,
  useGetDriversQuery,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} from "../../page/order/redux/api/apiSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Oderslidebar from "../../components/sidebar/oderslidebar";

const DrivervehicleDetails = () => {
  const [editingDriver, setEditingDriver] = useState(null);

  // RTK Query hooks
  const {
    data: driversFromRTK,
    isLoading: isLoadingRTK,
    isError: isErrorRTK,
  } = useGetDriversQuery();

  // Axios fallback state
  const [driversFromAxios, setDriversFromAxios] = useState([]);
  const [isLoadingAxios, setIsLoadingAxios] = useState(false);
  const [isAxiosFallback, setIsAxiosFallback] = useState(false);

  // Determine which data source to use
  const drivers = isAxiosFallback ? driversFromAxios : driversFromRTK;
  const isLoading = isAxiosFallback ? isLoadingAxios : isLoadingRTK;

  // Fallback to Axios if RTK Query fails
  useEffect(() => {
    const fetchWithAxios = async () => {
      if (isErrorRTK || !driversFromRTK) {
        setIsAxiosFallback(true);
        setIsLoadingAxios(true);
        try {
          const response = await axios.get("http://localhost:5000/api/drivers");
          setDriversFromAxios(response.data.data || response.data);
        } catch (error) {
          console.error("Axios error fetching drivers:", error);
        } finally {
          setIsLoadingAxios(false);
        }
      }
    };

    fetchWithAxios();
  }, [isErrorRTK, driversFromRTK]);

  // Form state
  const [formValues, setFormValues] = useState({
    name: "",
    dob: "",
    nic: "",
    telephone: "",
    vehicle: "",
    vehicleRegNo: "",
    licenseNo: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // RTK Query mutations
  const [createDriver] = useCreateDriverMutation();
  const [updateDriver] = useUpdateDriverMutation();
  const [deleteDriver] = useDeleteDriverMutation();

  // UI state
  const [message, setMessage] = useState({ type: "", text: "" });

  // Custom refetch function that handles both RTK and Axios
  const refetch = async () => {
    if (isAxiosFallback) {
      setIsLoadingAxios(true);
      try {
        const response = await axios.get("http://localhost:5000/api/drivers");
        setDriversFromAxios(response.data.data || response.data);
      } catch (error) {
        console.error("Error refetching drivers with axios:", error);
      } finally {
        setIsLoadingAxios(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation patterns
    const validations = {
      name: /^[A-Za-z\s]*$/, // Only English letters and spaces
      nic: /^\d{0,12}$/, // Up to 12 digits
      telephone: /^07[0-8]{0,1}-?\d{0,7}$/, // 07X-XXXXXXX format
      vehicle: /^[A-Za-z0-9\s-]*$/, // Letters, numbers, spaces, and hyphens
      vehicleRegNo: /^[A-Za-z0-9-]*$/, // Letters, numbers, and hyphens
      licenseNo: /^[A-Za-z]\d{0,7}$/, // Letter followed by up to 7 digits
    };

    // Check if value matches the pattern (if pattern exists for this field)
    if (validations[name] && value && !validations[name].test(value)) {
      return; // Don't update if validation fails
    }

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setFormValues({
      name: "",
      dob: "",
      nic: "",
      telephone: "",
      vehicle: "",
      vehicleRegNo: "",
      licenseNo: "",
    });
    setEditingDriver(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (isAxiosFallback) {
        // Using Axios for mutations if RTK Query failed
        if (editingDriver) {
          response = await axios.put(
            `http://localhost:5000/api/drivers/${editingDriver._id}`,
            formValues
          );
        } else {
          response = await axios.post(
            "http://localhost:5000/api/drivers",
            formValues
          );
        }
      } else {
        // Using RTK Query mutations
        if (editingDriver) {
          response = await updateDriver({
            id: editingDriver._id,
            ...formValues,
          }).unwrap();
        } else {
          response = await createDriver(formValues).unwrap();
        }
      }

      // After creating/updating driver, check for pending deliveries that need a driver
      if (!editingDriver) {
        try {
          const pendingDeliveries = await axios.get(
            "http://localhost:5000/api/deliveries"
          );
          const deliveriesWithoutDriver = pendingDeliveries.data.filter(
            (delivery) =>
              !delivery.assignedDriver && delivery.deliveryStatus === "Pending"
          );

          if (deliveriesWithoutDriver.length > 0) {
            // Assign the new driver to the first pending delivery
            await axios.put("http://localhost:5000/api/deliveries/status", {
              deliveryId: deliveriesWithoutDriver[0]._id,
              status: "Pending",
              assignedDriver: response._id,
            });
          }
        } catch (error) {
          console.error("Error assigning driver to pending deliveries:", error);
        }
      }

      setMessage({
        type: "success",
        text: editingDriver
          ? "Driver updated successfully"
          : "Driver added successfully",
      });

      setFormValues({
        name: "",
        dob: "",
        nic: "",
        telephone: "",
        vehicle: "",
        vehicleRegNo: "",
        licenseNo: "",
      });
      setEditingDriver(null);
      refetch();

      // Auto-dismiss message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Error adding/updating driver:", error);
      setMessage({
        type: "error",
        text: "Adding/updating unsuccessful. Please try again.",
      });

      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      if (isAxiosFallback) {
        await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      } else {
        await deleteDriver(id).unwrap();
      }

      setMessage({ type: "success", text: "Driver deleted successfully" });
      refetch();

      // Auto-dismiss message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Error deleting driver:", error);
      setMessage({
        type: "error",
        text: "Error deleting driver. Please try again.",
      });

      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }
  };

  const handleEditDriver = (nic) => {
    const driverToEdit = drivers.find((driver) => driver.nic === nic);
    setFormValues(driverToEdit);
    setEditingDriver(driverToEdit);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Helper function for header and footer
    const addHeader = () => {
      // No branding
    };

    const addFooter = (pageNum, totalPages) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128); // Gray-500
      doc.text(`Generated on ${currentDate}`, margin, pageHeight - 10);
      doc.text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth - margin - 30,
        pageHeight - 10
      );
    };

    // Cover Page
    addHeader();
    addFooter(1, 2);

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94); // Green-600
    doc.text("Driver List Report", margin, 60);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`Generated on ${currentDate}`, margin, 80);

    // Decorative line
    doc.setDrawColor(34, 197, 94); // Green-600
    doc.setLineWidth(0.5);
    doc.line(margin, 90, pageWidth - margin, 90);

    // Border
    doc.setDrawColor(37, 99, 235); // Blue-600
    doc.setLineWidth(0.3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Driver List Table Page
    doc.addPage();
    addHeader();
    addFooter(2, 2);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33); // Gray-900
    doc.text("Driver List", margin, 30);

    const headers = [
      "Item Number",
      "NIC",
      "Name",
      "DOB",
      "Telephone",
      "Vehicle",
      "Vehicle Reg No",
      "Driver License No",
    ];
    const data = drivers && drivers.length > 0
      ? drivers.map((driver, index) => [
          index + 1,
          driver.nic || "N/A",
          driver.name || "N/A",
          driver.dob || "N/A",
          driver.telephone || "N/A",
          driver.vehicle || "N/A",
          driver.vehicleRegNo || "N/A",
          driver.licenseNo || "N/A",
        ])
      : [["", "No drivers available", "", "", "", "", "", ""]];

    try {
      autoTable(doc, {
        startY: 40,
        head: [headers],
        body: data,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 12,
          cellPadding: 6,
          textColor: [33, 33, 33],
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [34, 197, 94], // Green-600
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 12,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240], // Gray-100
        },
        margin: { left: margin, right: margin },
        tableWidth: "wrap",
        columnStyles: {
          0: { cellWidth: 15, halign: "center" }, // Item Number
          1: { cellWidth: 25, halign: "left" }, // NIC
          2: { cellWidth: 35, halign: "left" }, // Name
          3: { cellWidth: 25, halign: "left" }, // DOB
          4: { cellWidth: 25, halign: "left" }, // Telephone
          5: { cellWidth: 25, halign: "left" }, // Vehicle
          6: { cellWidth: 17, halign: "left" }, // Vehicle Reg No
          7: { cellWidth: 15, halign: "left" }, // Driver License No
        },
      });
    } catch (error) {
      console.error("autoTable failed:", error.message, error.stack);
      let y = 40;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 33, 33);
      const columnWidths = [15, 25, 35, 25, 25, 25, 17, 15];
      let x = margin;
      headers.forEach((header, index) => {
        doc.text(header, x, y, { align: index === 0 ? "center" : "left" });
        x += columnWidths[index];
      });
      y += 10;
      doc.setFont("helvetica", "normal");
      data.forEach((row) => {
        x = margin;
        row.forEach((cell, index) => {
          doc.text(cell, x, y, { align: index === 0 ? "center" : "left" });
          x += columnWidths[index];
        });
        y += 10;
      });
    }

    // Save the PDF
    doc.save("driver_list_report.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Oderslidebar />
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md shadow-sm flex items-center ${
            message.type === "success"
              ? "bg-green-50 border-l-4 border-green-500"
              : "bg-red-50 border-l-4 border-red-500"
          }`}
        >
          <div
            className={`mr-3 ${
              message.type === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message.type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <span
            className={`${
              message.type === "success" ? "text-green-700" : "text-red-700"
            } font-medium`}
          >
            {message.text}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            {editingDriver ? "Update Driver Information" : "Add New Driver"}
          </h1>
          <form
            onSubmit={handleCreateOrUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Personal Information Section */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name{" "}
                    <span className="text-gray-500">
                      (English letters only)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    pattern="[A-Za-z\s]+"
                    title="Please use English letters and spaces only"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formValues.dob}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]} // Prevents future dates
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* NIC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIC
                  </label>
                  <input
                    type="text"
                    name="nic"
                    value={formValues.nic}
                    onChange={handleInputChange}
                    placeholder="20XXXXXXXXXX"
                    pattern="\d{12}"
                    title="NIC must be 12 digits"
                    maxLength="12"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Telephone/Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone/Mobile Number
                  </label>
                  <input
                    type="text"
                    name="telephone"
                    value={formValues.telephone}
                    onChange={handleInputChange}
                    placeholder="07X-XXXXXXX"
                    pattern="07[0-8]-?\d{7}"
                    title="Format: 07X-XXXXXXX (X: 0-8)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information Section */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Vehicle Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle
                  </label>
                  <input
                    type="text"
                    name="vehicle"
                    value={formValues.vehicle}
                    onChange={handleInputChange}
                    placeholder="Enter vehicle"
                    pattern="[A-Za-z0-9\s-]+"
                    title="Use letters, numbers, spaces, and hyphens only"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Vehicle Registration Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    name="vehicleRegNo"
                    value={formValues.vehicleRegNo}
                    onChange={handleInputChange}
                    placeholder="12-1234 or AB-1234 or ABC-1234"
                    pattern="^([0-9]{2}-[0-9]{4}|[A-Z]{2}-[0-9]{4}|[A-Z]{3}-[0-9]{4})$"
                    title="Format: 12-1234 or AB-1234 or ABC-1234"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Driver License Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNo"
                    value={formValues.licenseNo}
                    onChange={handleInputChange}
                    placeholder="A1234567"
                    pattern="[A-Za-z]\d{7}"
                    title="Format: One letter followed by 7 digits"
                    maxLength="8"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Buttons - span full width on the grid */}
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              >
                {editingDriver ? "Update Driver" : "Add Driver"}
              </button>
            </div>
          </form>
        </div>

        {/* Driver List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Driver List
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by NIC..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    NIC
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    DOB
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Telephone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vehicle
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vehicle Reg No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Driver License No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers &&
                  drivers
                    .filter(
                      (driver) =>
                        driver.nic &&
                        driver.nic
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((driver) => (
                      <tr key={driver.nic} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {driver.nic}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {driver.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {driver.dob}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {driver.telephone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {driver.vehicle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {driver.vehicleRegNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {driver.licenseNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditDriver(driver.nic)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-md px-3 py-1.5 mr-2 inline-flex items-center transition duration-150"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver._id)}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 rounded-md px-3 py-1.5 inline-flex items-center transition duration-150"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {/* Empty state handling */}
            {(!drivers || drivers.length === 0) && (
              <div className="text-center py-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No drivers found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrivervehicleDetails;