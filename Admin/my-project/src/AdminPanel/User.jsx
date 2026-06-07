import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Component/table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Filter, RefreshCcw } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(""); // "all", "admin", "user"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");

      if (search) params.append("search", search);
      if (role) params.append("role", role);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await axios.get(`/api/admin/users?${params.toString()}`);
      setUsers(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearch("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    axios.get("/api/admin/users?page=1&limit=10").then((res) => {
      setUsers(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    });
  };

  const handlePromote = async (email) => {
    try {
      await axios.put(`/api/update-admin`, { email });
      toast.success("User promoted to admin");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error promoting user");
    }
  };

  const handleRemoveAdmin = async (email) => {
    try {
      await axios.put(`/api/remove-admin`, { email });
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
      header: "Admin Status",
      accessor: "isAdmin",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            row.isAdmin
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          {row.isAdmin ? "Admin" : "Customer"}
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
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow transition transform hover:scale-102 font-bold cursor-pointer"
            >
              Promote
            </button>
          )}
          {row.isAdmin && (
            <button
              onClick={() => handleRemoveAdmin(row.email)}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-xl hover:bg-red-700 shadow transition transform hover:scale-102 font-bold cursor-pointer"
            >
              Remove Admin
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">Users</h1>
          <p className="text-gray-400 text-xs mt-1">Manage and filter supermarket customer accounts.</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-xs font-bold transition shadow-sm"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filters Form */}
      <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm mb-6">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
            <Filter size={16} className="text-green-600" /> Filter Users
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search Details</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Name, email, mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-gray-700"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Registered From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Registered To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-50 font-bold text-gray-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow"
            >
              Filter Users
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <>
          <div className="bg-white border border-gray-100 shadow rounded-3xl p-6 overflow-x-auto">
            <Table columns={columns} data={users} hoverable />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-100 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 font-bold">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
