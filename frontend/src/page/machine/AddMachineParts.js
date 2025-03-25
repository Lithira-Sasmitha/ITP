import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Add this import
import {
  useCreatePartMutation,
  useGetPartsQuery,
  useUpdatePartMutation,
  useDeletePartMutation,
} from "../../page/machine/redux/api/machinepartapiSlice";
import jsPDF from "jspdf";
import { machinepartapiSlice } from "../../page/machine/redux/api/machinepartapiSlice"; // Add this import

const AddMachinePart = () => {
  const dispatch = useDispatch(); // Initialize dispatch here
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
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
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
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!formValues.machinepartName || !formValues.machinepartId || !formValues.machinepartValue) {
      setMessage({
        type: "error",
        text: "All required fields must be filled.",
      });
      return;
    }

    try {
      if (editingPart) {
        const response = await updatePart({
          id: editingPart._id,
          updatedPart: formValues,
        }).unwrap();
        console.log("Update Response:", response);
        setMessage({ type: "success", text: "Part updated successfully" });
      } else {
        const response = await createPart(formValues).unwrap();
        console.log("Create Response:", response);  
        setMessage({ type: "success", text: "Part added successfully" });
      }

      setFormValues({
        machinepartName: "",
        machinepartId: "",
        machinepartPurchaseDate: "",
        machinepartWarrantyPeriod: "",
        machinepartValue: "",
      });
      setEditingPart(null);
      refetch();
    } catch (error) {
      console.error("Error in Create/Update:", error);
      setMessage({ type: "error", text: "Operation unsuccessful. Try again." });
    }
  };

  const handleDeletePart = async (id) => {
    try {
      const response = await deletePart(id).unwrap();
      console.log("Delete Response:", response);
      setMessage({ type: "success", text: "Part deleted successfully" });

      // Optimistic update to remove the deleted part from the list
      dispatch(
        machinepartapiSlice.util.updateQueryData(
          "getParts",
          undefined,
          (draft) => {
            const index = draft.findIndex((part) => part._id === id || part.id === id);
            if (index !== -1) {
              draft.splice(index, 1); // Delete the part from the list
            }
          }
        )
      );
      refetch(); // Re-fetch the part list after deletion
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
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Machine Parts List", 20, 20);
    parts.forEach((part, index) => {
      doc.text(
        `${index + 1}. ${part.machinepartName} - $${part.machinepartValue},`,
        20,
        30 + index * 10
      );
    });
    doc.save("machine_parts.pdf");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-5">Manage Machine Parts</h1>
      <form onSubmit={handleCreateOrUpdate} className="space-y-4">
        <div>
          <lable htmlFor="machinepartName" className="block text-sm font-medium text-gray-700">
            Part Name
            </lable>
        <input
          type="text"
          name="machinepartName"
          value={formValues.machinepartName}
          onChange={handleInputChange}
          placeholder=" Part Name"
          className="border rounded-md px-4 py-2 w-full"
        />
        </div>
        <div>
        <label htmlFor="machinepartId" className="block text-sm font-medium text-gray-700">
            Part ID
          </label>
        <input
          type="text"
          name="machinepartId"
          value={formValues.machinepartId}
          onChange={handleInputChange}
          placeholder="Part ID"
          className="border rounded-md px-4 py-2 w-full"
        />
        </div>
        <div>
        <label htmlFor="machinepartPurchaseDate" className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
        <input
          type="date"
          name="machinepartPurchaseDate"
          value={formValues.machinepartPurchaseDate}
          onChange={handleInputChange}
          className="border rounded-md px-4 py-2 w-full"
        />
        </div>
        <div>
        <label htmlFor="machinepartWarrantyPeriod" className="block text-sm font-medium text-gray-700">
            Warranty Period
          </label>
        <input
          type="number"
          name="machinepartWarrantyPeriod"
          value={formValues.machinepartWarrantyPeriod}
          onChange={handleInputChange}
          placeholder="Warranty Period"
          className="border rounded-md px-4 py-2 w-full"
        />
        </div>
        <div>
        <label htmlFor="machinepartValue" className="block text-sm font-medium text-gray-700">
            Part Value
          </label>
        <input
          type="number"
          name="machinepartValue"
          value={formValues.machinepartValue}
          onChange={handleInputChange}
          placeholder="Value"
          className="border rounded-md px-4 py-2 w-full"
        />
        </div>


        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            {editingPart ? "Update Part" : "Add Part"}
          </button>
        </div>
      </form>


      <h1 className="text-3xl font-bold mt-8">Machine Parts List</h1>
      <div className="flex justify-between mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Machine Parts name..."
            className="border rounded-md px-4 py-2 w-full max-w-md"
          />
      <button
        type="button"
        onClick={handleDownloadPDF}
        className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded mb-4"
      >
        Download PDF
      </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Purchase Date</th>
            <th className="border px-4 py-2">Warranty Period</th>
            <th className="border px-4 py-2">Value</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parts &&
            parts
              .filter((part) =>
                part.machinepartName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((part) => (
                <tr key={part.machinepartId} className="border">
                  <td className="border px-4 py-2">{part.machinepartName}</td>
                  <td className="border px-4 py-2">{part.machinepartId}</td>
                  <td className="border px-4 py-2">{part.machinepartPurchaseDate}</td>
                  <td className="border px-4 py-2">{part.machinepartWarrantyPeriod}</td>
                  <td className="border px-4 py-2">${part.machinepartValue}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditPart(part)}
                      className="bg-green-700  hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePart(part._id)}
                      className="bg-red-600  hover:bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* Success/Error Messages */}
      {message.text && (
        <div
          className={`mt-4 p-3 rounded-md text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default AddMachinePart;