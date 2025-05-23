import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { default as api } from "../../store/apiSLice";
import toast from "react-hot-toast";

export default function AddSalary({ open, setOpen }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [addSallary] = api.useAddSallaryMutation();

  const [basic, setBasic] = useState("");
  const [otHours, setOtHours] = useState("");
  const [amount, setAmount] = useState(0);

  const handleCalculate = (e) => {
    e.preventDefault();
    const calculatedAmount = parseFloat(basic) + parseFloat(otHours) * 1000;
    setAmount(calculatedAmount);
  };

  const onSubmit = async (data) => {
    if (!data) return {};
    try {
      await addSallary(data).unwrap();
      setAmount(0); // Reset amount to 0
      reset();
      toast.success("Salary added successfully");
    } catch (error) {
      toast.error("Error adding salary");
    }
  };

  return (
    <div>
      <div
        className={`${
          open ? "block" : "hidden"
        } fixed z-10 inset-0 overflow-y-auto`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          ></div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Employee No.
                    </label>
                    <input
                      type="text"
                      {...register("empno", { required: "Employee No. is required" })}
                      placeholder="Employee No"
                      className={`bg-gray-200 appearance-none border-2 border-green-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 ${
                        errors.empno ? "border-red-500" : ""
                      }`}
                    />
                    {errors.empno && (
                      <div className="text-red-500 mb-4">{errors.empno.message}</div>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 sm:w-1/2">
                    <div className="w-full">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Employee Name.
                      </label>
                      <input
                        type="text"
                        {...register("empname", { required: "Employee Name is required" })}
                        placeholder="Employee Name"
                        className={`bg-gray-200 appearance-none border-2 border-green-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 ${
                          errors.empname ? "border-red-500" : ""
                        }`}
                      />
                      {errors.empname && (
                        <div className="text-red-500 mb-4">{errors.empname.message}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:ml-3 sm:w-1/2">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      {...register("date", { required: "Date is required" })}
                      className={`bg-gray-200 appearance-none border-2 border-green-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 ${
                        errors.date ? "border-red-500" : ""
                      }`}
                    />
                    {errors.date && (
                      <div className="text-red-500 mb-4">{errors.date.message}</div>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 sm:w-1/2">
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Department
                    </label>
                    <select
                      {...register("department", { required: "Department is required" })}
                      className={`mt-1 block bg-gray-200 w-full py-2 px-3 border border-green-300  rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                        errors.department ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Department</option>
                      <option value="IT">Mar</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                    </select>
                    {errors.department && (
                      <div className="text-red-500 mb-4">{errors.department.message}</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 sm:flex sm:items-start">
                  <div className="w-full">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Amount"
                      {...register("amount", { required: "Amount is required", min: { value: 0, message: "Amount must be greater than or equal to 0" } })}
                      className={`bg-gray-200 appearance-none border-2 border-green-200 rounded w-full py-2 px-4 text-green-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 ${
                        errors.amount ? "border-red-500" : ""
                      }`}
                    />
                    {errors.amount && (
                      <div className="text-red-500 mb-4">{errors.amount.message}</div>
                    )}
                  </div>
                </div>
              
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-800 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

AddSalary.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  productData: PropTypes.object,
};
