import { useState, useEffect } from "react";
import { FaEnvelope, FaPlus, FaDownload, FaTrash, FaEdit } from "react-icons/fa";
import Header from "../../components/header/header";

function Salary() {
  const [salaries, setSalaries] = useState([
    { id: 1, employee: "John Doe", amount: 3500, date: "2025-03-01", section: "Engineering" },
    { id: 2, employee: "Jane Smith", amount: 4200, date: "2025-03-01", section: "Marketing" },
    { id: 3, employee: "Robert Johnson", amount: 3800, date: "2025-03-01", section: "HR" },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSalary, setNewSalary] = useState({
    employee: "",
    amount: "",
    date: "",
    section: ""
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSalary({
      ...newSalary,
      [name]: value
    });
  };
  
  const handleAddSalary = () => {
    const salaryToAdd = {
      id: salaries.length + 1,
      ...newSalary,
      amount: parseFloat(newSalary.amount)
    };
    
    setSalaries([...salaries, salaryToAdd]);
    setNewSalary({
      employee: "",
      amount: "",
      date: "",
      section: ""
    });
    setShowAddModal(false);
  };
  
  const handleDownloadCSV = () => {
    // Create CSV content
    const headers = ["ID", "Employee", "Amount", "Date", "Section"];
    const csvContent = [
      headers.join(","),
      ...salaries.map(salary => [
        salary.id,
        salary.employee,
        salary.amount,
        salary.date,
        salary.section
      ].join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "salary_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="relative z-10">
      <Header title='Salary' />
      
      <div className="container mx-auto px-4 py-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaPlus className="mr-2" /> Add Salary
            </button>
            <button 
              onClick={handleDownloadCSV} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaDownload className="mr-2" /> Download
            </button>
          </div>
        </div>
        
        {/* Salary List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.employee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${salary.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.section}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Salary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Salary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                <input
                  type="text"
                  name="employee"
                  value={newSalary.employee}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newSalary.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newSalary.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <select
                  name="section"
                  value={newSalary.section}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Section</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSalary}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Salary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Salary;