import React, { useState } from "react";
import {
  useCreateDriverMutation,
  useGetDriversQuery,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} from "../../page/order/redux/api/apiSlice";
import jsPDF from "jspdf";

const DrivervehicleDetails = () => {
  const [editingDriver, setEditingDriver] = useState(null);
  const { data: drivers, refetch } = useGetDriversQuery();
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
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
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
      if (editingDriver) {
        await updateDriver({
          id: editingDriver._id,
          ...formValues,
        }).unwrap();
        setMessage({ type: "success", text: "Driver updated successfully" });
      } else {
        await createDriver(formValues).unwrap();
        setMessage({ type: "success", text: "Driver added successfully" });
      }

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
    } catch (error) {
      console.error("Error adding/updating driver:", error);
      setMessage({
        type: "error",
        text: "Adding/unsubmitting unsuccessful. Please try again.",
      });
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await deleteDriver(id).unwrap();
      setMessage({ type: "success", text: "Driver deleted successfully" });
      refetch();
    } catch (error) {
      console.error("Error deleting driver:", error);
      setMessage({
        type: "error",
        text: "Error deleting driver. Please try again.",
      });
    }
  };

  const handleEditDriver = (nic) => {
    const driverToEdit = drivers.find((driver) => driver.nic === nic);
    setFormValues(driverToEdit);
    setEditingDriver(driverToEdit);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Driver List", 20, 20);

    drivers.forEach((driver, index) => {
      doc.text(
        `${index + 1}. ${driver.name} - ${driver.nic}`,
        20,
        30 + index * 10
      );
    });

    doc.save("drivers.pdf");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      {/* Form Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-5">Add New Driver</h1>
        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name (English letters only)
            </label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formValues.dob}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* NIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NIC
            </label>
            <input
              type="text"
              name="nic"
              value={formValues.nic}
              onChange={handleInputChange}
              placeholder="20XXXXXXXXXX"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Telephone/Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telephone/Mobile Number
            </label>
            <input
              type="text"
              name="telephone"
              value={formValues.telephone}
              onChange={handleInputChange}
              placeholder="07X-XXXXXXX"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Vehicle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vehicle
            </label>
            <input
              type="text"
              name="vehicle"
              value={formValues.vehicle}
              onChange={handleInputChange}
              placeholder="Enter vehicle"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Vehicle Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vehicle Registration Number
            </label>
            <input
              type="text"
              name="vehicleRegNo"
              value={formValues.vehicleRegNo}
              onChange={handleInputChange}
              placeholder="12-1234 or AB-1234 or ABC-1234"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Driver License Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Driver License Number
            </label>
            <input
              type="text"
              name="licenseNo"
              value={formValues.licenseNo}
              onChange={handleInputChange}
              placeholder="A1234567"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingDriver ? "Update Driver" : "Add Driver"}
            </button>
          </div>
        </form>
      </div>

      {/* Driver List Section */}
      <div>
        <h1 className="text-3xl font-bold mb-5">Driver List</h1>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by NIC..."
            className="border rounded-md px-4 py-2 w-full max-w-md"
          />
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Download PDF
          </button>
        </div>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">NIC</th>
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">DOB</th>
              <th className="border border-gray-200 px-4 py-2">Telephone</th>
              <th className="border border-gray-200 px-4 py-2">Vehicle</th>
              <th className="border border-gray-200 px-4 py-2">
                Vehicle Reg No
              </th>
              <th className="border border-gray-200 px-4 py-2">
                Driver License No
              </th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers &&
              drivers
                .filter(
                  (driver) =>
                    driver.nic &&
                    driver.nic.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((driver) => (
                  <tr key={driver.nic}>
                    <td className="border border-gray-200 px-4 py-2">
                      {driver.nic}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {driver.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {driver.dob}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {driver.telephone}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {driver.vehicle}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {driver.vehicleRegNo}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {driver.licenseNo}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                        onClick={() => handleEditDriver(driver.nic)}
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

export default DrivervehicleDetails;
