import React, { useState, useEffect } from "react";
import Salarylist from "../../components/list/salarylist";
import AddSalary from "../../components/form/addsalary";
import { default as api } from "../../store/apiSLice";
import EditSallary from "../../components/form/editsallary";
import Fin_sidebar from "../../components/sidebar/fin_sidebar";
import { BlobProvider } from '@react-pdf/renderer';
import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";

// Define the PDF styles outside the component
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    marginVertical: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  tableCell: {
    fontSize: 12,
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  cellWidth: {
    width: "20%", 
  },
  headerColor: {
    backgroundColor: "#15803d", 
    color: "#ffffff", 
  },
});

// Define the PDF Document component outside the main component
const SalaryPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Employee Salary Details</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeaderCell, styles.cellWidth, styles.headerColor]}>
            Employee No.
          </Text>
          <Text style={[styles.tableHeaderCell, styles.cellWidth, styles.headerColor]}>
            Employee Name
          </Text>
          <Text style={[styles.tableHeaderCell, styles.cellWidth, styles.headerColor]}>
            Department
          </Text>
          <Text style={[styles.tableHeaderCell, styles.cellWidth, styles.headerColor]}>
            Amount
          </Text>
          <Text style={[styles.tableHeaderCell, styles.cellWidth, styles.headerColor]}>
            Date
          </Text>
        </View>
        {Array.isArray(data) && data.map((item) => (
          <View style={styles.tableRow} key={item._id}>
            <Text style={[styles.tableCell, styles.cellWidth]}>
              {item.empno || ""}
            </Text>
            <Text style={[styles.tableCell, styles.cellWidth]}>
              {item.empname || ""}
            </Text>
            <Text style={[styles.tableCell, styles.cellWidth]}>
              {item.department || ""}
            </Text>
            <Text style={[styles.tableCell, styles.cellWidth]}>
              {item.amount || ""}
            </Text>
            <Text style={[styles.tableCell, styles.cellWidth]}>
              {item.date || ""}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Simple SVG icons to replace box-icons
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#030712" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

function Salary() {
  const { data, isFetching, isSuccess, isError } = api.useGetSallaryQuery();
  const [deleteSallary] = api.useDeleteSallaryMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);

  // Only enable PDF generation when data is available
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setFilteredData(data);
      setPdfReady(true);
    }
  }, [data]);

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleOpenEdit = (item) => {
    setEditData(item);
    setOpenDialog1(true);
  };

  const handlerClick = (id) => {
    if (!id) return;
    deleteSallary({ _id: id })
      .unwrap()
      .then(() => console.log('Delete successful'))
      .catch(error => console.error('Delete failed:', error));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (data && Array.isArray(data)) {
      const filtered = data.filter((item) => {
        const empno = item?.empno?.toLowerCase() || "";
        const empname = item?.empname?.toLowerCase() || "";
        const department = item?.department?.toLowerCase() || "";
        const amount = String(item?.amount)?.toLowerCase() || "";
        const date = item?.date?.toLowerCase() || "";

        return (
          empno.includes(query) ||
          empname.includes(query) ||
          department.includes(query) ||
          amount.includes(query) ||
          date.includes(query)
        );
      });
      setFilteredData(filtered);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - with full height */}
      <div className="h-screen sticky top-0">
        <Fin_sidebar />
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="bg-white shadow-md py-6 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-green-900">Salary Management</h1>
            <p className="text-green-600 mt-1">Manage employee compensation records</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                className="flex items-center justify-center px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
                onClick={handleOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Employee Salary
              </button>
              
              {/* PDF Download Link - using BlobProvider instead of PDFDownloadLink */}
              {pdfReady ? (
                <BlobProvider document={<SalaryPDF data={searchQuery ? filteredData : data} />}>
                  {({ blob, url, loading, error }) => (
                    <a
                      href={url || '#'}
                      download="salary_management.pdf"
                      className={`flex items-center justify-center px-4 py-2 rounded-md ${url ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'} font-medium hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto`}
                      disabled={!url}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {loading ? "Preparing PDF..." : "Download PDF"}
                    </a>
                  )}
                </BlobProvider>
              ) : (
                <button 
                  className="flex items-center justify-center px-4 py-2 rounded-md bg-gray-300 text-gray-500 font-medium cursor-not-allowed w-full sm:w-auto"
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  No Data for PDF
                </button>
              )}
            </div>
            
            {/* Search Box */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, department, amount..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
            
          {/* Add salary modal */}
          <AddSalary open={openDialog} setOpen={setOpenDialog} />
          
          {/* Edit salary modal */}
          {openDialog1 && (
            <EditSallary
              open={openDialog1}
              setOpen={setOpenDialog1}
              productData={editData}
            />
          )}
          
          {/* Loading State */}
          {isFetching && (
            <div className="flex justify-center items-center p-12 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              <p className="ml-3 text-gray-600">Loading data...</p>
            </div>
          )}
          
          {/* Error State */}
          {isError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800">Error fetching data. Please try again.</p>
              </div>
            </div>
          )}
          
          {/* Table */}
          {isSuccess && data && Array.isArray(data) && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-600 to-green-500">
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Employee No.
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-white uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(searchQuery ? filteredData : data).map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.empno}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.empname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {item.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          ${parseFloat(item.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center space-x-2">
                          <button 
                            className="p-1.5 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                            onClick={() => handlerClick(item._id)}
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                          
                          <button 
                            className="p-1.5 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                          > 
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination placeholder */}
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(searchQuery ? filteredData : data).length}</span> records
                </div>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {isSuccess && (!data || data.length === 0) && (
            <div className="text-center bg-white shadow-md rounded-lg p-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No salary records</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new salary record.</p>
              <div className="mt-6">
                <button
                  onClick={handleOpen}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Record
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Salary;