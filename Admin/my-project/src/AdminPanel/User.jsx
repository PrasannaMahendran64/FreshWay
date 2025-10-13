import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Component/table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/get-users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  const handlePromote = async (email) => {
    try {
      await axios.put(`http://localhost:4000/update-admin`, { email });
      toast.success("User promoted to admin");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error promoting user");
    }
  };

  const handleRemoveAdmin = async (email) => {
    try {
      await axios.put(`http://localhost:4000/remove-admin`, { email });
      toast.success("Admin rights removed");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error removing admin rights");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Mobile", accessor: "mobilenumber" },
    {
      header: "Admin",
      accessor: "isAdmin",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full font-medium text-white ${
            row.isAdmin
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          {row.isAdmin ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex gap-2">
          {!row.isAdmin && (
            <button
              onClick={() => handlePromote(row.email)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition duration-300"
            >
              Promote
            </button>
          )}
          {row.isAdmin && (
            <button
              onClick={() => handleRemoveAdmin(row.email)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-105 transition duration-300"
            >
              Remove Admin
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Users</h1>
      <div className="bg-white shadow-lg rounded-xl p-6 overflow-x-auto">
        <Table columns={columns} data={users} hoverable />
      </div>
    </div>
  );
}
