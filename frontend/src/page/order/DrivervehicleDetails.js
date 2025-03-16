import React, { useState } from "react";
import {
  useCreateDriverMutation,
  useGetDriversQuery,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} from "../../page/order/redux/api/apiSlice";
import jsPDF from "jspdf";

const DriverVehicleDetails = () => {
  const [editingDriver, setEditingDriver] = useState(null);
  const { data: drivers = [], refetch } = useGetDriversQuery();
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
  const [createDriver] = useCreateDriverMutation();
  const [updateDriver] = useUpdateDriverMutation();
  const [deleteDriver] = useDeleteDriverMutation();
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
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
      if (editingDriver) {
        await updateDriver({ id: editingDriver._id, ...formValues }).unwrap();
        setMessage({ type: "success", text: "Driver updated successfully" });
      } else {
        await createDriver(formValues).unwrap();
        setMessage({ type: "success", text: "Driver added successfully" });
      }

      handleCancel(); // Reset form values after success
      await refetch(); // Ensure the driver list updates properly
    } catch (error) {
      console.error("Error adding/updating driver:", error);
      setMessage({
        type: "error",
        text: "Operation failed. Please try again.",
      });
    }
  };

  const handleDeleteDriver = async (id) => {
    if (!id) {
      console.error("Invalid driver ID");
      setMessage({ type: "error", text: "Invalid driver ID." });
      return;
    }

    try {
      await deleteDriver(id).unwrap(); // Ensure correct id format
      setMessage({ type: "success", text: "Driver deleted successfully" });
      refetch(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting driver:", error);
      setMessage({
        type: "error",
        text:
          error?.data?.message || "Error deleting driver. Please try again.",
      });
    }
  };

  const handleEditDriver = (id) => {
    const driverToEdit = drivers.find((driver) => driver._id === id);
    if (driverToEdit) {
      setFormValues(driverToEdit);
      setEditingDriver(driverToEdit);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Driver List", 20, 20);

    drivers.forEach((driver, index) => {
      doc.text(
        `${index + 1}. ${driver.name} - ${driver.nic} - ${driver.vehicle} - ${
          driver.vehicleRegNo
        } - ${driver.licenseNo}`,
        20,
        30 + index * 10
      );
    });

    doc.save("drivers.pdf");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-5">Driver Management</h1>
      <form onSubmit={handleCreateOrUpdate} className="space-y-4">
        {Object.keys(formValues).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type={key === "dob" ? "date" : "text"}
              name={key}
              value={formValues[key]}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        ))}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingDriver ? "Update Driver" : "Add Driver"}
          </button>
        </div>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Driver List</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by NIC..."
          className="border rounded-md px-4 py-2 w-full max-w-md mb-4"
        />
        <button
          onClick={handleDownloadPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
        <table className="min-w-full border mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">DOB</th>
              <th className="border px-4 py-2">NIC</th>
              <th className="border px-4 py-2">Telephone</th>
              <th className="border px-4 py-2">Vehicle</th>
              <th className="border px-4 py-2">Vehicle Reg No</th>
              <th className="border px-4 py-2">License No</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers
              .filter((driver) =>
                driver.nic.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((driver) => (
                <tr key={driver._id}>
                  <td className="border px-4 py-2">{driver.name}</td>
                  <td className="border px-4 py-2">{driver.dob}</td>
                  <td className="border px-4 py-2">{driver.nic}</td>
                  <td className="border px-4 py-2">{driver.telephone}</td>
                  <td className="border px-4 py-2">{driver.vehicle}</td>
                  <td className="border px-4 py-2">{driver.vehicleRegNo}</td>
                  <td className="border px-4 py-2">{driver.licenseNo}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditDriver(driver._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverVehicleDetails;
