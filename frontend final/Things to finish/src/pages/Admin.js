import HeritageLayout from "../components/HeritageLayout";
import { useState, useEffect } from "react";
import { FiCheck, FiX, FiEye, FiUser, FiPackage, FiBarChart2 } from "react-icons/fi";

const Admin = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending items on mount
  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/items/pending");
      if (response.ok) {
        const data = await response.json();
        setPendingItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch pending items", err);
    } finally {
      setLoading(false);
    }
  };

  const [users, setUsers] = useState([
    { id: 1, name: "Amanuel", email: "amanuel@example.com", role: "contributor", status: "active" },
    { id: 2, name: "Ezana", email: "ezana@example.com", role: "viewer", status: "active" },
    { id: 3, name: "Fenet", email: "fenet@example.com", role: "admin", status: "active" },
    { id: 4, name: "Fiker", email: "fiker@example.com", role: "contributor", status: "suspended" },
  ]);



  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/items/${id}/approve`, {
        method: "PUT"
      });
      if (response.ok) {
        setPendingItems(pendingItems.filter(item => item.id !== id));
        alert(`Item ${id} approved successfully!`);
      }
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/items/${id}/deny`, {
        method: "PUT"
      });
      if (response.ok) {
        setPendingItems(pendingItems.filter(item => item.id !== id));
        alert(`Item ${id} denied.`);
      }
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  return (
    <HeritageLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Administration Panel</h1>
          <p className="text-gray-600">Manage users, content, and system settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Items</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiPackage className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUser className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved Items</p>
                <p className="text-3xl font-bold text-green-600 mt-1">142</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">System Health</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">98%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiBarChart2 className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard Updated</h2>
          <p className="text-gray-600 mb-4">
            User management and pending content review have been moved to the System Administrator Dashboard.
          </p>
          <p className="text-gray-500 text-sm">
            Please contact a System Administrator if you need to perform these actions.
          </p>
        </div>

        {/* System Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            System Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-left">
              <h3 className="font-semibold">Run Backup</h3>
              <p className="text-sm mt-1">Create system backup</p>
            </button>

            <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-left">
              <h3 className="font-semibold">Generate Reports</h3>
              <p className="text-sm mt-1">Create usage statistics</p>
            </button>

            <button className="p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-left">
              <h3 className="font-semibold">System Logs</h3>
              <p className="text-sm mt-1">View system activity</p>
            </button>
          </div>
        </div>
      </div>
    </HeritageLayout>
  );
};

export default Admin;

