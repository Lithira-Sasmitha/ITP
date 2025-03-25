import React, { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import Salarylist from "../../components/list/salarylist";
import AddSalary from "../../components/form/addsalary";
import { default as api } from "../../store/apiSLice";
import EditSallary from "../../components/form/editsallary";

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
    width: "20%", // Adjust the width as needed for each column
  },
  headerColor: {
    backgroundColor: "#15803d", // Background color for headers
    color: "#ffffff", // Text color for headers
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
    <div className="flex flex-col md:flex-row relative">
      <div className="absolute inset-y-0 left-0 z-10">

      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center drop-shadow-lg text-gray-800">
          <div></div>
          <h1 className="text-4xl py-8 mb-10 bg-red-500 text-white rounded-lg w-96 h-16 flex justify-center items-center mx-auto mt-2">
            Salary Management
          </h1>
        </div>
        <div className="flex flex-col">
          <div className="sm:-mx-6 lg:-mx-8 w-2/3 mx-auto">
            <div className="flex justify-between items-center mb-4">
              <button
                className="px-3 rounded-md border border-transparent shadow-sm py-2 bg-green-800 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleOpen}
                style={{ width: "200px", marginLeft: "500px" }}
              >
                Add Employee Salary
              </button>
              
              {/* PDF Download Link - only render when data is ready */}
              {pdfReady ? (
                <PDFDownloadLink
                  document={<SalaryPDF data={searchQuery ? filteredData : data} />}
                  fileName="salary_management.pdf"
                  className="px-3 rounded-md border border-transparent shadow-sm py-2 bg-green-800 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  style={{ width: "200px", textDecoration: "none", display: "inline-block", textAlign: "center" }}
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Loading document..." : "Download PDF"
                  }
                </PDFDownloadLink>
              ) : (
                <button 
                  className="px-3 rounded-md border border-transparent shadow-sm py-2 bg-gray-400 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  style={{ width: "200px", cursor: "not-allowed" }}
                  disabled
                >
                  No Data for PDF
                </button>
              )}
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
            
            {isFetching && <div>Loading...</div>}
            {isError && <div>Error fetching data</div>}
            {isSuccess && data && Array.isArray(data) && (
              <div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="mt-4 px-4 py-2 mb-4 border-2 border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full"
                  style={{ marginLeft: "350px" }}
                />
                <table
                  className="min-w-full divide-y divide-gray-200"
                  style={{ marginLeft: "350px" }}
                >
                  <thead className="bg-green-300">
                    <tr>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Employee No.
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-green-300">
                    {(searchQuery ? filteredData : data).map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.empno}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.empname}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.department}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex">
                          <button 
                            className="px-3" 
                            onClick={() => handlerClick(item._id)}
                          >
                            <TrashIcon />
                          </button>
                          
                          <button 
                            className="px-3" 
                            onClick={() => handleOpenEdit(item)}
                          > 
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Salary;