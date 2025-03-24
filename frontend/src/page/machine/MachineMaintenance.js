import React, { useState } from 'react';

const MachineMaintenance = () => {
  const [formValues, setFormValues] = useState({
    machineName: '',
    machineId: '',
    issue: '',
    warranty: 'no',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleWarrantyChange = (e) => {
    setFormValues({
      ...formValues,
      warranty: e.target.value,
    });
  };

  const handleSendEmail = async () => {
    // In a real-world scenario, you would make an API call here to send the email.
    if (formValues.warranty === 'yes') {
      try {
        // Simulate email sending
        setMessage({ type: 'success', text: 'Automated email sent to company!' });
        // Make API call to send the email on the backend
        // await sendEmailToCompany(formValues);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to send email. Try again later.' });
      }
    } else {
      setMessage({ type: 'info', text: 'Machine is not under warranty.' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-5">Machine Maintenance</h1>
      
      <form className="space-y-4">
        {/* Machine Name */}
        <div>
          <label htmlFor="machineName" className="block text-sm font-medium text-gray-700">
            Machine Name
          </label>
          <input
            type="text"
            name="machineName"
            value={formValues.machineName}
            onChange={handleInputChange}
            placeholder="Enter machine name"
            className="border rounded-md px-4 py-2 w-full"
          />
        </div>

        {/* Machine ID */}
        <div>
          <label htmlFor="machineId" className="block text-sm font-medium text-gray-700">
            Machine ID
          </label>
          <input
            type="text"
            name="machineId"
            value={formValues.machineId}
            onChange={handleInputChange}
            placeholder="Enter machine ID"
            className="border rounded-md px-4 py-2 w-full"
          />
        </div>

        {/* Issue */}
        <div>
          <label htmlFor="issue" className="block text-sm font-medium text-gray-700">
            Issue Description
          </label>
          <textarea
            name="issue"
            value={formValues.issue}
            onChange={handleInputChange}
            placeholder="Describe the machine issue"
            className="border rounded-md px-4 py-2 w-full"
          />
        </div>

        {/* Check Warranty */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Is the machine under warranty?</label>
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                name="warranty"
                value="yes"
                checked={formValues.warranty === 'yes'}
                onChange={handleWarrantyChange}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="warranty"
                value="no"
                checked={formValues.warranty === 'no'}
                onChange={handleWarrantyChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Send Email Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleSendEmail}
            className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Send Email to Company
          </button>
        </div>
      </form>

      {/* Message */}
      {message.text && (
        <div
          className={`mt-4 p-3 rounded-md text-white ${
            message.type === 'success'
              ? 'bg-green-500'
              : message.type === 'error'
              ? 'bg-red-500'
              : 'bg-yellow-500'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default MachineMaintenance;
