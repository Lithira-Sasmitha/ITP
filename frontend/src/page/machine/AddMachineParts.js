import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useCreatePartMutation,
  useGetPartsQuery,
  useUpdatePartMutation,
  useDeletePartMutation,
} from "../../page/machine/redux/api/machinepartapiSlice";
import jsPDF from "jspdf";
import Machinesidebar from "../../components/sidebar/Machinesidebar";

const AddMachinePart = () => {
  const dispatch = useDispatch();
  const [editingPart, setEditingPart] = useState(null);
  const { data: parts, refetch } = useGetPartsQuery();
  const [formValues, setFormValues] = useState({
    machinepartName: "",
    machinepartId: "",
    machinepartPurchaseDate: "",
    machinepartWarrantyPeriod: "",
    machinepartValue: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [createPart] = useCreatePartMutation();
  const [updatePart] = useUpdatePartMutation();
  const [deletePart] = useDeletePartMutation();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const handleCancel = () => {
    setFormValues({
      machinepartName: "",
      machinepartId: "",
      machinepartPurchaseDate: "",
      machinepartWarrantyPeriod: "",
      machinepartValue: "",
    });
    setEditingPart(null);
    setErrors({});
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!formValues.machinepartName)
      newErrors.machinepartName = "Part Name is required.";
    else if (
      formValues.machinepartName.length < 3 ||
      formValues.machinepartName.length > 50
    )
      newErrors.machinepartName =
        "Part Name must be between 3 and 50 characters.";

    if (!formValues.machinepartId)
      newErrors.machinepartId = "Part ID is required.";
    else if (!/^[a-zA-Z0-9-]+$/.test(formValues.machinepartId))
      newErrors.machinepartId =
        "Part ID must contain only letters, numbers, or hyphens.";

    if (
      formValues.machinepartPurchaseDate &&
      isNaN(Date.parse(formValues.machinepartPurchaseDate))
    )
      newErrors.machinepartPurchaseDate = "Purchase Date must be a valid date.";

    if (
      formValues.machinepartWarrantyPeriod &&
      (isNaN(formValues.machinepartWarrantyPeriod) ||
        Number(formValues.machinepartWarrantyPeriod) < 0)
    )
      newErrors.machinepartWarrantyPeriod =
        "Warranty Period must be a positive number.";

    if (!formValues.machinepartValue)
      newErrors.machinepartValue = "Part Value is required.";
    else if (
      isNaN(formValues.machinepartValue) ||
      Number(formValues.machinepartValue) <= 0
    )
      newErrors.machinepartValue = "Part Value must be a positive number.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingPart) {
        await updatePart({
          id: editingPart._id,
          updatedPart: formValues,
        }).unwrap();
        setMessage({ type: "success", text: "Part updated successfully" });
      } else {
        await createPart(formValues).unwrap();
        setMessage({ type: "success", text: "Part added successfully" });
      }
      handleCancel();
      refetch();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error in Create/Update:", error);
      setMessage({ type: "error", text: "Operation unsuccessful. Try again." });
    }
  };

  const handleDeletePart = async (id) => {
    try {
      await deletePart(id).unwrap();
      setMessage({ type: "success", text: "Part deleted successfully" });
      refetch();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting part:", error);
      setMessage({ type: "error", text: "Error deleting part. Try again." });
    }
  };

  const handleEditPart = (part) => {
    setFormValues({
      machinepartName: part.machinepartName,
      machinepartId: part.machinepartId,
      machinepartPurchaseDate: part.machinepartPurchaseDate,
      machinepartWarrantyPeriod: part.machinepartWarrantyPeriod,
      machinepartValue: part.machinepartValue,
    });
    setEditingPart(part);
    setErrors({});
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Machine Parts List", 20, 20);
    parts.forEach((part, index) => {
      doc.text(
        `${index + 1}. ${part.machinepartName} - $${part.machinepartValue}`,
        20,
        30 + index * 10
      );
    });
    doc.save("machine_parts.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* This is Sidebar */}
      <div className="fixed h-screen w-64 flex-shrink-0">
        <Machinesidebar />
      </div>

      {/* This is Main Content */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-screen">
          {/* Header */}
          <header className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-black-900">
              Manage Machine Parts
            </h1>
            <p className="text-gray-600 mt-2">
              Add, edit, and delete machine part details
            </p>
          </header>

          {/* Form Section */}
          <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingPart ? "Edit Machine Part" : "Add New Machine Part"}
            </h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Name *
                </label>
                <input
                  type="text"
                  name="machinepartName"
                  value={formValues.machinepartName}
                  onChange={handleInputChange}
                  placeholder="Enter part name"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.machinepartName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.machinepartName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machinepartName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part ID *
                </label>
                <input
                  type="text"
                  name="machinepartId"
                  value={formValues.machinepartId}
                  onChange={handleInputChange}
                  placeholder="Enter part ID"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.machinepartId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.machinepartId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machinepartId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="machinepartPurchaseDate"
                  value={formValues.machinepartPurchaseDate}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.machinepartPurchaseDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.machinepartPurchaseDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machinepartPurchaseDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty Period (months)
                </label>
                <input
                  type="number"
                  name="machinepartWarrantyPeriod"
                  value={formValues.machinepartWarrantyPeriod}
                  onChange={handleInputChange}
                  placeholder="Enter warranty period"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.machinepartWarrantyPeriod
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.machinepartWarrantyPeriod && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machinepartWarrantyPeriod}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Value *
                </label>
                <input
                  type="number"
                  name="machinepartValue"
                  value={formValues.machinepartValue}
                  onChange={handleInputChange}
                  placeholder="Enter part value"
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                    errors.machinepartValue
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.machinepartValue && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machinepartValue}
                  </p>
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
                  {editingPart ? "Update Part" : "Add Part"}
                </button>
              </div>
            </form>
          </section>

          {/* Parts List Section */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Machine Parts List
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
              placeholder="Search by part name..."
              className="w-full max-w-md border rounded-md p-3 mb-4 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            {parts && parts.length > 0 ? (
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
                        Purchase Date
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Warranty Period
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
                    {parts
                      .filter((part) =>
                        part.machinepartName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((part) => (
                        <tr
                          key={part._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-gray-200 px-4 py-2">
                            {part.machinepartName}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {part.machinepartId}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {part.machinepartPurchaseDate || "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {part.machinepartWarrantyPeriod || "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            ${part.machinepartValue}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditPart(part)}
                                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePart(part._id)}
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
              <p className="text-gray-500 text-center py-4">No parts found.</p>
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

export default AddMachinePart;
