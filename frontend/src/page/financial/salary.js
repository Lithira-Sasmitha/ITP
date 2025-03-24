// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   useGetSalariesQuery, 
//   useDeleteSalaryMutation 
// } from '../../store/apiSlice';
// import { 
//   selectAllSalaries, 
//   selectSalaryStatus, 
//   selectSalaryError,
//   selectCurrentSalary,
//   setCurrentSalary,
//   clearCurrentSalary 
// } from '../../store/salarySlice';
// import SalaryForm from '../../components/SalaryForm'; 

// const Salary = () => {
//   const dispatch = useDispatch();
//   const [isFormOpen, setIsFormOpen] = useState(false);
  
//   // Get salaries from API
//   const { refetch } = useGetSalariesQuery();
  
//   // Get salaries from state
//   const salaries = useSelector(selectAllSalaries);
//   const status = useSelector(selectSalaryStatus);
//   const error = useSelector(selectSalaryError);
//   const currentSalary = useSelector(selectCurrentSalary);
  
//   // Delete mutation
//   const [deleteSalary] = useDeleteSalaryMutation();
  
//   // Handle opening form in add mode
//   const handleAddSalary = () => {
//     dispatch(clearCurrentSalary());
//     setIsFormOpen(true);
//   };
  
//   // Handle opening form in edit mode
//   const handleEditSalary = (salary) => {
//     dispatch(setCurrentSalary(salary));
//     setIsFormOpen(true);
//   };
  
//   // Handle delete salary
//   const handleDeleteSalary = async (id) => {
//     if (window.confirm('Are you sure you want to delete this salary?')) {
//       try {
//         await deleteSalary(id).unwrap();
//       } catch (err) {
//         console.error('Failed to delete salary:', err);
//       }
//     }
//   };
  
//   // Handle form close
//   const handleFormClose = () => {
//     setIsFormOpen(false);
//     dispatch(clearCurrentSalary());
//   };
  
//   // Handle salary change (add or update)
//   const handleSalaryChange = () => {
//     refetch();
//   };
  
//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Salary Management</h1>
//         <button
//           onClick={handleAddSalary}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Add New Salary
//         </button>
//       </div>
      
//       {status === 'loading' && <p>Loading...</p>}
      
//       {status === 'failed' && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           Error: {error}
//         </div>
//       )}
      
//       {status === 'succeeded' && salaries.length === 0 && (
//         <p>No salaries found. Add one to get started.</p>
//       )}
      
//       {status === 'succeeded' && salaries.length > 0 && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-lg shadow-md">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employee
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Section
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {salaries.map((salary) => (
//                 <tr key={salary._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {salary.employeeName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {salary.section}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     ${parseFloat(salary.amount).toFixed(2)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {new Date(salary.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => handleEditSalary(salary)}
//                       className="text-indigo-600 hover:text-indigo-900 mr-3"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteSalary(salary._id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
      
//       {isFormOpen && (
//         <SalaryForm
//           onClose={handleFormClose}
//           onSalaryChange={handleSalaryChange}
//           salaryToEdit={currentSalary}
//         />
//       )}
//     </div>
//   );
// };

// export default Salary;