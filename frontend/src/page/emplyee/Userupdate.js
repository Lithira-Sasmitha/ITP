import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Userupdate = () => {
  const handleRoleChange = (e) => {
    setroll(e.target.value);
  };

  const { userid } = useParams();

  const [id, setid] = useState("");
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [role, setroll] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const response = (
          await axios.post(`http://localhost:5055/api/users/getuser/${userid}`)
        ).data;

        setid(response.user._id);
        setfullName(response.user.fullName);
        setemail(response.user.email);
        setphone(response.user.phone);
        setroll(response.user.role);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, []);

  async function Updateuser(e) {
    e.preventDefault();

    const updateuser = {
      fullName,
      email,
      phone,
      role,
    };

    try {
      const response = (
        await axios.put(
          `http://localhost:5055/api/users/updateuser/${userid}`,
          updateuser
        )
      ).data;

      Swal.fire("Congratulations", "User updated successfully", "success").then(
        () => {
          window.location.href = "/allusers";
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="">
  <div className="flex justify-center">
    <div data-aos="zoom-in" className="w-full max-w-xl mt-10 bg-white shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-[#25D366] py-4 rounded-t-3xl text-center">
        <h1 className="text-3xl font-extrabold italic text-white tracking-wider drop-shadow-lg">
          Update User
        </h1>
        <div className="w-20 h-1 bg-white rounded-full mx-auto mt-3"></div>
      </div>

      <div className="p-10">
        <form onSubmit={Updateuser} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ID</label>
            <input
              type="text"
              value={id}
              readOnly
              required
              className="w-full rounded-xl border border-gray-300 bg-gray-100 py-3 px-5 text-gray-700 font-medium focus:ring-2 focus:ring-[#25D366] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white py-3 px-5 text-gray-700 font-medium focus:ring-2 focus:ring-[#25D366] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white py-3 px-5 text-gray-700 font-medium focus:ring-2 focus:ring-[#25D366] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              onInput={(e) => {
                const maxLength = 10;
                const enteredValue = e.target.value.replace(/\D/g, '');
                if (enteredValue.length !== maxLength) {
                  toast.error("Phone number must be 10 digits.");
                  setphone(enteredValue.slice(0, maxLength));
                } else {
                  setphone(enteredValue);
                }
              }}
              minLength={10}
              maxLength={10}
              required
              className="w-full rounded-xl border border-gray-300 bg-white py-3 px-5 text-gray-700 font-medium focus:ring-2 focus:ring-[#25D366] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <select
              value={role}
              onChange={handleRoleChange}
              required
              className="w-full rounded-xl border border-gray-300 bg-white py-3 px-5 text-gray-700 font-medium focus:ring-2 focus:ring-[#25D366] focus:outline-none"
            >
              <option value="User">User</option>
              <option value="Employee manager">Employee manager</option>
              <option value="Tunnel manager">Tunnel manager</option>
              <option value="Financial manager">Financial manager</option>
              <option value="Target manager">Target manager</option>
              <option value="Courier service">Courier service</option>
              <option value="Inventory manager">Inventory manager</option>
              <option value="Machine manager">Machine manager</option>
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="mt-6 w-full md:w-96 text-white bg-[#25D366] hover:bg-[#1DA851] font-semibold py-3 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#1DA851]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default Userupdate;
