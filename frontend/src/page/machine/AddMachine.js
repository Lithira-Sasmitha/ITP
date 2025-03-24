import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Add this import
import {
  useCreateMachineMutation,
  useGetMachinesQuery,
  useUpdateMachineMutation,
  useDeleteMachineMutation,
} from "../../page/machine/redux/api/machineapiSlice";
import jsPDF from "jspdf";
import { machineapiSlice } from "../../page/machine/redux/api/machineapiSlice"; // Add this import

const AddMachine = () => {
  const dispatch = useDispatch(); // Initialize dispatch here
  const [editingMachine, setEditingMachine] = useState(null);
  const { data: machines, refetch } = useGetMachinesQuery();
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
  const [errors, setErrors] = useState({}); // Changed from message to errors object
  const [message, setMessage] = useState({ type: "", text: "" }); // Keep for success/error from API

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    // Clear error for the field being edited
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
    setErrors({}); // Clear errors on cancel
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});
    const newErrors = {};

    // Validation logic
    if (!formValues.name) newErrors.name = "Machine Name is required.";
    else if (formValues.name.length < 3 || formValues.name.length > 50)
      newErrors.name = "Machine Name must be between 3 and 50 characters.";

    if (!formValues.id) newErrors.id = "Machine ID is required.";
    else if (!/^[a-zA-Z0-9-]+$/.test(formValues.id))
      newErrors.id = "Machine ID must contain only letters, numbers, or hyphens.";

    if (formValues.status && !["Active", "Inactive"].includes(formValues.status))
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

    // If there are errors, set them and return
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

      setFormValues({
        name: "",
        id: "",
        status: "",
        purchaseDate: "",
        warrantyDate: "",
        value: "",
      });
      setEditingMachine(null);
      setErrors({}); // Clear errors on success
      refetch();
    } catch (error) {
      setMessage({ type: "error", text: "Operation unsuccessful. Try again." });
    }
  };

  const handleDeleteMachine = async (id) => {
    try {
      console.log("Deleting machine with ID:", id); // Debugging log

      await deleteMachine(id).unwrap();

      setMessage({ type: "success", text: "Machine deleted successfully" });
      refetch(); // Ensure the machine list updates
    } catch (error) {
      console.error("Error deleting machine:", error);
      setMessage({ type: "error", text: "Error deleting machine. Try again." });
    }
  };

  const handleEditMachine = (machine) => {
    setFormValues({ ...machine,
      name: machine.name,
      id: machine.id, 
      status: machine.status,
      purchaseDate: machine.purchaseDate,
      warrantyDate: machine.warrantyDate,
      value: machine.value,
    });
    setEditingMachine(machine);
    setErrors({}); // Clear errors when editing
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Machine List", 20, 20);
    machines.forEach((machine, index) => {
      doc.text(
        `${index + 1}. ${machine.name} - $${machine.value},`,
        20,
        30 + index * 10
      );
    });
    doc.save("machines.pdf");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-5">Manage Machines</h1>
      <form onSubmit={handleCreateOrUpdate} className="space-y-4">
        {/* Input Fields with Updated Labels */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Machine Name
          </label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Machine Name"
            className="border rounded-md px-4 py-2 w-full"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            Machine ID
          </label>
          <input
            type="text"
            name="id"
            value={formValues.id}
            onChange={handleInputChange}
            placeholder="Machine ID"
            className="border rounded-md px-4 py-2 w-full"
          />
          {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Machine Status
          </label>
          <select
            name="status"
            value={formValues.status}
            onChange={handleInputChange}
            className="border rounded-md px-4 py-2 w-full"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            name="purchaseDate"
            value={formValues.purchaseDate}
            onChange={handleInputChange}
            className="border rounded-md px-4 py-2 w-full"
          />
          {errors.purchaseDate && <p className="text-red-500 text-sm mt-1">{errors.purchaseDate}</p>}
        </div>
        <div>
          <label htmlFor="warrantyDate" className="block text-sm font-medium text-gray-700">
            Warranty Date
          </label>
          <input
            type="date"
            name="warrantyDate"
            value={formValues.warrantyDate}
            onChange={handleInputChange}
            className="border rounded-md px-4 py-2 w-full"
          />
          {errors.warrantyDate && <p className="text-red-500 text-sm mt-1">{errors.warrantyDate}</p>}
        </div>
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Machine Value
          </label>
          <input
            type="number"
            name="value"
            value={formValues.value}
            onChange={handleInputChange}
            placeholder="Machine Value"
            className="border rounded-md px-4 py-2 w-full"
          />
          {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
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
            {editingMachine ? "Update Machine" : "Add Machine"}
          </button>
        </div>
      </form>

      {/* Machine List Section */}
      <h1 className="text-3xl font-bold mt-8">Machine List</h1>
      <div className="flex justify-between mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Machine name..."
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
            <th className="border px-4 py-2">Machine Name</th>
            <th className="border px-4 py-2">Machine ID</th>
            <th className="border px-4 py-2">Machine Status</th>
            <th className="border px-4 py-2">Purchase Date</th>
            <th className="border px-4 py-2">Warranty Date</th>
            <th className="border px-4 py-2">Machine Value</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machines &&
            machines
              .filter((machine) =>
                machine.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((machine) => (
                <tr key={machine.id} className="border">
                  <td className="border px-4 py-2">{machine.name}</td>
                  <td className="border px-4 py-2">{machine.id}</td>
                  <td className="border px-4 py-2">{machine.status}</td>
                  <td className="border px-4 py-2">{machine.purchaseDate}</td>
                  <td className="border px-4 py-2">{machine.warrantyDate}</td>
                  <td className="border px-4 py-2">${machine.value}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEditMachine(machine)}
                      className="bg-green-700  hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMachine(machine._id)}
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

export default AddMachine;