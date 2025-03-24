import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import "jspdf-autotable"; // this should come AFTER jsPDF
import autoTable from 'jspdf-autotable';
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

AOS.init({
  duration: 2500,
});





//read all users
function Allusers() {
  const [users, setusers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);

  const [duplicateusers, setduplicateusers] = useState([]);

  const [searchkey, setsearchkey] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        "http://localhost:5055/api/users/getallusers"
      );
      setusers(data.data);
      setduplicateusers(data.data); // Update duplicateusers with fetched data
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //Add users popup form handle check
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    console.log(formDataObject);
    closeModal(); // Close the modal after form submission
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  //add users for the System
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  async function adduser(event) {
    event.preventDefault();

    if (password == cpassword) {
      if (phone.length !== 10) {
        toast.error("Phone number must be 10 digits.");
        return; // Exit the function if phone number is not valid
      }

      const user = {
        fullName,
        email,
        phone,
        password,
        cpassword,
      };

      try {
        setLoading(true);
        const result = await axios.post(
          "http://localhost:5055/api/users/register",
          user
        );

        console.log(result.data);
        closeModal();
        Swal.fire("Congratulations", "User added successfully", "success").then(
          () => {
            window.location.reload();
          }
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      toast.error("Password dosen't match");
    }
  }

  //delete specific user
  const deleteuser = async (id) => {
    try {
      setLoading(true);
      const confirmed = await Swal.fire({
        title: "Are you sure remove user?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmed.isConfirmed) {
        await axios.delete(`http://localhost:5055/api/users/delete/${id}`);
        fetchData(); // Reload data after successful deletion
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User deleted successfully!",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //search user using name

  // Search user using name and filter by type
  function filterBySearch() {
    const filteredBySearch = duplicateusers.filter((user) =>
      user.fullName.toLowerCase().includes(searchkey.toLowerCase())
    );

    if (type !== "all") {
      const filteredByTypeAndSearch = filteredBySearch.filter(
        (user) => user.role && user.role.toLowerCase().includes(type)
      );
      setusers(filteredByTypeAndSearch);
    } else {
      setusers(filteredBySearch);
    }

    // Check if the filtered array is empty
    if (filteredBySearch.length === 0) {
      toast.error("User not found.");
    }
  }

  const [type, settype] = useState("all");

  //search user according to user type
  function filterByType(e) {
    const selectedType = e.target.value.toLowerCase();
    settype(selectedType);

    if (selectedType !== "all") {
      const tempUsers = duplicateusers.filter(
        (user) => user.role && user.role.toLowerCase().includes(selectedType)
      );
      setusers(tempUsers);
    } else {
      setusers(duplicateusers);
    }
  }

  const generateReport = () => {
    if (users.length === 0) {
      Swal.fire("No data", "There are no users to generate a report.", "info");
      return;
    }
  
    Swal.fire({
      title: "Generate PDF",
      text: "Are you sure you want to generate the PDF report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Generate",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          // Create jsPDF instance
          const doc = new jsPDF();
          const currentDate = new Date().toLocaleDateString();
          const currentTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const pdfName = `Users_Report_${currentDate}.pdf`;
  
          // Add title and date
          doc.setFontSize(20);
          doc.text("Users Report", 20, 20);
  
          doc.setFontSize(12);
          doc.text(`Date: ${currentDate}`, 20, 30);
          doc.text(`Time: ${currentTime}`, doc.internal.pageSize.getWidth() - 50, 30);
  
          // Setup table data
          const headers = ["Name", "Email", "Phone", "Role"];
          const data = users.map((user) => [
            user.fullName || "-",
            user.email || "-",
            user.phone || "-",
            user.role || "-",
          ]);
  
          // Generate table directly using the imported autoTable function
          autoTable(doc, {
            head: [headers],
            body: data,
            startY: 40,
            headStyles: { fillColor: [72, 200, 27], textColor: [255, 255, 255] }
          });
  
          // Save the PDF
          doc.save(pdfName);
          Swal.fire("PDF Generated!", "", "success");
        } catch (error) {
          console.error("PDF generation error:", error);
          Swal.fire("Error", "Failed to generate PDF: " + error.message, "error");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "PDF generation cancelled", "info");
      }
    }
  );
  };

  return (
    <div>
       
        <Sidebar/>

          {isModalOpen && (
            // Popup form
            <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
              <div
                ref={modalRef}
                className="bg-white rounded-3xl overflow-hidden shadow-xl max-w-md"
              >
                <div className="px-12 py-12">
  <h2 className="text-2xl font-semibold text-dark font-custom mb-6 tracking-wide">
    Enter the user's details
  </h2>

  <form onSubmit={adduser} className="space-y-5">
    <input
      type="text"
      placeholder="Enter user name"
      value={fullName}
      onChange={(e) => setfullName(e.target.value)}
      className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
      required
    />

    <input
      type="email"
      placeholder="Enter email"
      value={email}
      onChange={(e) => setemail(e.target.value)}
      className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
      required
    />

    <input
      type="tel"
      placeholder="Enter phone"
      value={phone}
      onChange={(e) => setphone(e.target.value)}
      onInput={(e) => {
        const maxLength = 10;
        if (e.target.value.length > maxLength) {
          toast.error("Phone number cannot exceed 10 digits.");
          e.target.value = e.target.value.slice(0, maxLength);
          setphone(e.target.value);
        }
      }}
      className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
      required
      minLength={10}
      maxLength={10}
    />

    <input
      type="password"
      placeholder="Enter password"
      value={password}
      onChange={(e) => setpassword(e.target.value)}
      className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
      required
    />

    <input
      type="password"
      placeholder="Confirm password"
      value={cpassword}
      onChange={(e) => setcpassword(e.target.value)}
      className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
      required
    />

                  <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full py-3 px-6 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-full font-custom text-md transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1DA851]"
                           >
                          Submit
                       </button>

                      </div> 
                    </form>
                 </div>

              </div>
            </div>
          )}

          <div className="flex justify-center items-center ml-48 h-full ">
            <div className="overflow-x-auto shadow-2xl sm:rounded-lg ml-16 mb-4">
             
              <thead>
                <tr>
                  <div className="flex items-center">
                    {/*search ,filter and add button*/}
                    <input
                      type="text"
                      placeholder="Search name..."
                      className="mt-6 p-1 pl-10 block w-72 ml-10 mb-4  rounded-3xl dark:bg-table-row border-solid border-2 border-gray focus:outline-whatsapp-green placeholder-gray-500 placeholder-opacity-50 font-custom text-md shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-110"
                      value={searchkey}
                      onChange={(e) => {
                        setsearchkey(e.target.value);
                      }}
                      onKeyUp={filterBySearch}
                    />

                     <select
                      id="countries"
                      value={type}
                      onChange={(e) => filterByType(e)}
                      className="mt-2 p-2 pr-10 pl-5 mr-20 ml-20 block rounded-full bg-[#E9F9EE] text-green-900 border-none focus:outline-none focus:ring-2 focus:ring-[#25D366] dark:bg-gray-800 dark:text-white placeholder-gray-500 font-custom text-md shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                       <option value="all">All</option>
                       <option value="user">User</option>
                       <option value="employee manager">Employee manager</option>
                       <option value="tunnel manager">Tunnel manager</option>
                       <option value="financial manager">Financial manager</option>
                       <option value="target manager">Target manager</option>
                       <option value="Courior servise">Courier service</option>
                       <option value="inventory manager">Inventory manager</option>
                       <option value="machine manager">Machine manager</option>
                    </select>



                  <div className="flex items-center gap-4 mr-20 mt-1">
                      <button
                        className="text-white bg-[#25D366] hover:bg-[#1DA851] focus:outline-none font-medium rounded-full px-10 py-1 text-center font-sans shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-110"
                        onClick={generateReport}
                          >
                        Generate Report
                      </button>

                      <button
                        type="button"
                        className="text-white bg-[#25D366] hover:bg-[#1DA851] focus:outline-none font-medium rounded-full px-10 py-1 text-center font-sans shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-110"
                        onClick={openModal}
                          >
                        Add
                      </button>
                      <button
                        type="button"
                        className="text-white bg-[#25D366] hover:bg-[#1DA851] focus:outline-none font-medium rounded-full px-10 py-1 text-center font-sans shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-110"
                        onClick={() => navigate("/requestedleave")} // Replace with your actual route 
                          >
                        Reqest leave
                      </button>
                      <button
                        type="button"
                        className="text-white bg-[#25D366] hover:bg-[#1DA851] focus:outline-none font-medium rounded-full px-10 py-1 text-center font-sans shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-110"
                        onClick={() => navigate("/approveleave")} // Replace with your actual route 
                          >
                       Manage leaave
                      </button>
                    </div>


                  </div>
                </tr>
              </thead>
              <table
  data-aos="zoom-out"
  className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-300 shadow-lg rounded-xl overflow-hidden"
>
  <thead className="text-xs text-whatsapp-green uppercase bg-wight-green dark:bg-whatsapp-green dark:text-wight-green">
    <tr>
      <th scope="col" className="px-6 py-3 text-center">name</th>
      <th scope="col" className="px-6 py-3 text-center">email</th>
      <th scope="col" className="px-6 py-3 text-center">Phone</th>
      <th scope="col" className="px-6 py-3 text-center">image</th>
      <th scope="col" className="px-6 py-3 text-center">roll</th>
      <th scope="col" className="px-6 py-3 text-center">Action</th>
    </tr>
  </thead>

  <tbody>
    {users.length > 0 ? (
      users.map((user, index) => (
        <tr
          key={user._id}
          className={`${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          } dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors duration-200`}
        >
          <td className="px-6 py-4 text-green-900 dark:text-green-200 text-center font-medium">
            {user.fullName}
          </td>
          <td className="px-6 py-4 text-green-900 dark:text-green-200 text-center">
            {user.email}
          </td>
          <td className="px-6 py-4 text-green-900 dark:text-green-200 text-center">
            {user.phone}
          </td>
          <td className="px-6 py-4 text-center">
            <img
              className="w-10 h-10 rounded-full mx-auto shadow-md object-cover"
              src={user.imageurl}
              alt="profile"
            />
          </td>
          <td className="px-6 py-4 text-green-900 dark:text-green-200 text-center">
            {user.role}
          </td>
          <td className="px-6 py-4 text-green-900 dark:text-green-200 text-center">
            <Link to={`/e_updates/${user._id}`}>
              <button className="btn1 mr-3">
                <FaEdit className="mr-5 text-xl" />
              </button>
            </Link>
            <button className="btn1" onClick={() => deleteuser(user._id)}>
              <MdDeleteForever className="mr-5 text-2xl text-red-500" />
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center py-4 text-red-500">
          User not found.
        </td>
      </tr>
    )}
  </tbody>
</table>

            </div>
          </div>
      
    
    </div>
  );
}

export default Allusers;
