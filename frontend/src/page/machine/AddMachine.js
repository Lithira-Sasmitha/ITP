import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useCreateMachineMutation,
  useGetMachinesQuery,
  useUpdateMachineMutation,
  useDeleteMachineMutation,
} from "../../page/machine/redux/api/machineapiSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Machinesidebar from "../../components/sidebar/Machinesidebar";

const AddMachine = () => {
  const dispatch = useDispatch();
  const [editingMachine, setEditingMachine] = useState(null);
  const { data: machinesData, refetch } = useGetMachinesQuery();
  const [formValues, setFormValues] = useState({
    name: "",
    id: "",
    status: "",
    purchaseDate: "",
    warrantyDate: "",
    value: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [createMachine] = useCreateMachineMutation();
  const [updateMachine] = useUpdateMachineMutation();
  const [deleteMachine] = useDeleteMachineMutation();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  // Ensure machines is always an array
  const machines = Array.isArray(machinesData?.data) ? machinesData.data : [];

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const handleCancel = () => {
    setFormValues({
      name: "",
      id: "",
      status: "",
      purchaseDate: "",
      warrantyDate: "",
      value: "",
    });
    setEditingMachine(null);
    setErrors({});
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!formValues.name) newErrors.name = "Machine Name is required.";
    else if (formValues.name.length < 3 || formValues.name.length > 50)
      newErrors.name = "Machine Name must be between 3 and 50 characters.";

    if (!formValues.id) newErrors.id = "Machine ID is required.";
    else if (!/^[a-zA-Z0-9-]+$/.test(formValues.id))
      newErrors.id =
        "Machine ID must contain only letters, numbers, or hyphens.";

    if (
      formValues.status &&
      !["Active", "Inactive"].includes(formValues.status)
    )
      newErrors.status = "Machine Status must be either Active or Inactive.";

    if (formValues.purchaseDate && isNaN(Date.parse(formValues.purchaseDate)))
      newErrors.purchaseDate = "Purchase Date must be a valid date.";

    if (formValues.warrantyDate && isNaN(Date.parse(formValues.warrantyDate)))
      newErrors.warrantyDate = "Warranty Date must be a valid date.";

    if (formValues.purchaseDate && formValues.warrantyDate) {
      const purchaseDate = new Date(formValues.purchaseDate);
      const warrantyDate = new Date(formValues.warrantyDate);
      if (warrantyDate <= purchaseDate)
        newErrors.warrantyDate = "Warranty Date must be after Purchase Date.";
    }

    if (!formValues.value) newErrors.value = "Machine Value is required.";
    else if (isNaN(formValues.value) || Number(formValues.value) <= 0)
      newErrors.value = "Machine Value must be a positive number.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingMachine) {
        await updateMachine({
          id: editingMachine._id,
          updatedMachine: formValues,
        }).unwrap();
        setMessage({ type: "success", text: "Machine updated successfully" });
      } else {
        await createMachine(formValues).unwrap();
        setMessage({ type: "success", text: "Machine added successfully" });
      }
      handleCancel();
      refetch();
    } catch (error) {
      console.error("Operation failed:", error);
      setMessage({
        type: "error",
        text: error.data?.message || "Operation failed. Please try again.",
      });
    }
  };

  const handleDeleteMachine = async (id) => {
    try {
      await deleteMachine(id).unwrap();
      setMessage({ type: "success", text: "Machine deleted successfully" });
      refetch();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting machine:", error);
      setMessage({ type: "error", text: "Error deleting machine. Try again." });
    }
  };

  const handleEditMachine = (machine) => {
    setFormValues({
      name: machine.name,
      id: machine.id,
      status: machine.status,
      purchaseDate: machine.purchaseDate,
      warrantyDate: machine.warrantyDate,
      value: machine.value,
    });
    setEditingMachine(machine);
    setErrors({});
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
    doc.text("Machine List Report", margin, 60);

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

    // Machine List Table Page
    doc.addPage();
    addHeader();
    addFooter(2, 2);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33); // Gray-900
    doc.text("Machine List", margin, 30);

    const headers = [
      "Machine Name",
      "ID",
      "Status",
      "Purchase Date",
      "Warranty Date",
      "Value",
    ];
    const data =
      machines && machines.length > 0
        ? machines.map((machine) => [
            machine.name || "N/A",
            machine.id || "N/A",
            machine.status || "N/A",
            machine.purchaseDate
              ? new Date(machine.purchaseDate).toLocaleDateString()
              : "N/A",
            machine.warrantyDate
              ? new Date(machine.warrantyDate).toLocaleDateString()
              : "N/A",
            machine.value ? `$${parseFloat(machine.value).toFixed(2)}` : "N/A",
          ])
        : [["No machines available", "", "", "", "", ""]];

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
          0: { cellWidth: 40, halign: "left" }, // Machine Name
          1: { cellWidth: 25, halign: "left" }, // ID
          2: { cellWidth: 25, halign: "left" }, // Status
          3: { cellWidth: 25, halign: "left" }, // Purchase Date
          4: { cellWidth: 25, halign: "left" }, // Warranty Date
          5: { cellWidth: 27, halign: "center" }, // Value
        },
      });
    } catch (error) {
      console.error("autoTable failed:", error.message, error.stack);
      let y = 40;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 33, 33);
      const columnWidths = [40, 25, 25, 25, 25, 27];
      let x = margin;
      headers.forEach((header, index) => {
        doc.text(header, x, y, {
          align: index === 5 ? "center" : "left",
        });
        x += columnWidths[index];
      });
      y += 10;
      doc.setFont("helvetica", "normal");
      data.forEach((row) => {
        x = margin;
        row.forEach((cell, index) => {
          doc.text(cell, x, y, {
            align: index === 5 ? "center" : "left",
          });
          x += columnWidths[index];
        });
        y += 10;
      });
    }

    // Save the PDF
    doc.save("machine_list_report.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="fixed h-screen w-64 flex-shrink-0">
        <Machinesidebar />
      </div>

      {/* This is Main Content */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-screen">
          <header className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-black-900">
              Manage Machines
            </h1>
            <p className="text-gray-600 mt-2">
              Add, edit, and delete machine details
            </p>
          </header>

          {/* This is Form Section */}
          <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingMachine ? "Edit Machine" : "Add New Machine"}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  placeholder="Enter machine name"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine ID *
                </label>
                <input
                  type="text"
                  name="id"
                  value={formValues.id}
                  onChange={handleInputChange}
                  placeholder="Enter machine ID"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.id ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">{errors.id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine Status
                </label>
                <select
                  name="status"
                  value={formValues.status}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formValues.purchaseDate}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.purchaseDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.purchaseDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.purchaseDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty Period
                </label>
                <input
                  type="date"
                  name="warrantyDate"
                  value={formValues.warrantyDate}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.warrantyDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.warrantyDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.warrantyDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine Value *
                </label>
                <input
                  type="number"
                  name="value"
                  value={formValues.value}
                  onChange={handleInputChange}
                  placeholder="Enter machine value"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.value ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.value && (
                  <p className="text-red-500 text-sm mt-1">{errors.value}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  {editingMachine ? "Update Machine" : "Add Machine"}
                </button>
              </div>
            </form>
          </section>

          {/* Machine List Section */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Machine List
              </h2>
              <button
                onClick={handleDownloadPDF}
                className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Download PDF
              </button>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by machine name..."
              className="w-full max-w-md border rounded-md p-3 mb-4 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            {machines && machines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Purchase Date
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Warranty Date
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Value
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {machines
                      .filter((machine) =>
                        machine.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((machine) => (
                        <tr
                          key={machine._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-gray-200 px-4 py-2">
                            {machine.name}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {machine.id}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {machine.status || "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {machine.purchaseDate
                              ? new Date(
                                  machine.purchaseDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {machine.warrantyDate
                              ? new Date(
                                  machine.warrantyDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            ${machine.value}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditMachine(machine)}
                                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMachine(machine._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No machines found.
              </p>
            )}
          </section>

          {/* Success/Error Message */}
          {message.text && (
            <div
              className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${
                message.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
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

export default AddMachine;
