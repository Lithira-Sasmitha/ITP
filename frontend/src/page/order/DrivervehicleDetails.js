import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import axios from "axios";

const DrivervehicleDetails = () => {
  const [editingDriver, setEditingDriver] = useState(null);
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
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/drivers");
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        // Update driver
        await axios.put(
          `http://localhost:5000/drivers/${editingDriver._id}`,
          formValues
        );
        setMessage({ type: "success", text: "Driver updated successfully" });
      } else {
        // Create driver
        await axios.post("http://localhost:5000/drivers", formValues);
        setMessage({ type: "success", text: "Driver added successfully" });
      }
      resetForm();
      fetchDrivers();
    } catch (error) {
      console.error("Error adding/updating driver:", error);
      setMessage({
        type: "error",
        text: "Adding/updating unsuccessful. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/drivers/${id}`);
      setMessage({ type: "success", text: "Driver deleted successfully" });
      fetchDrivers();
    } catch (error) {
      console.error("Error deleting driver:", error);
      setMessage({
        type: "error",
        text: "Error deleting driver. Please try again.",
      });
    }
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

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormValues({
      name: driver.name,
      dob: driver.dob,
      nic: driver.nic,
      telephone: driver.telephone,
      vehicle: driver.vehicle,
      vehicleRegNo: driver.vehicleRegNo,
      licenseNo: driver.licenseNo,
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-5">Add New Driver</h1>
        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formValues.dob}
              onChange={handleInputChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="nic">NIC</label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formValues.nic}
              onChange={handleInputChange}
              placeholder="Enter NIC"
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="telephone">Telephone</label>
            <input
              type="text"
              id="telephone"
              name="telephone"
              value={formValues.telephone}
              onChange={handleInputChange}
              placeholder="Enter telephone"
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="vehicle">Vehicle</label>
            <input
              type="text"
              id="vehicle"
              name="vehicle"
              value={formValues.vehicle}
              onChange={handleInputChange}
              placeholder="Enter vehicle name"
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="vehicleRegNo">Vehicle Registration No</label>
            <input
              type="text"
              id="vehicleRegNo"
              name="vehicleRegNo"
              value={formValues.vehicleRegNo}
              onChange={handleInputChange}
              placeholder="Enter vehicle registration number"
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="licenseNo">License No</label>
            <input
              type="text"
              id="licenseNo"
              name="licenseNo"
              value={formValues.licenseNo}
              onChange={handleInputChange}
              placeholder="Enter license number"
              className="border p-2 rounded-md"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              {editingDriver ? "Update Driver" : "Add Driver"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white p-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Driver List Section */}
      <div>
        <h1 className="text-3xl font-bold mb-5">Driver List</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by NIC"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md"
          />
        </div>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">NIC</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">DOB</th>
              <th className="border px-4 py-2">Telephone</th>
              <th className="border px-4 py-2">Vehicle</th>
              <th className="border px-4 py-2">Vehicle Reg No</th>
              <th className="border px-4 py-2">Driver License No</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers
              .filter((driver) => driver.nic.includes(searchTerm))
              .map((driver) => (
                <tr key={driver._id}>
                  <td className="border px-4 py-2">{driver.nic}</td>
                  <td className="border px-4 py-2">{driver.name}</td>
                  <td className="border px-4 py-2">{driver.dob}</td>
                  <td className="border px-4 py-2">{driver.telephone}</td>
                  <td className="border px-4 py-2">{driver.vehicle}</td>
                  <td className="border px-4 py-2">{driver.vehicleRegNo}</td>
                  <td className="border px-4 py-2">{driver.licenseNo}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(driver)}
                      className="bg-yellow-500 text-white p-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(driver._id)}
                      className="bg-red-500 text-white p-2 rounded-md ml-2"
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
