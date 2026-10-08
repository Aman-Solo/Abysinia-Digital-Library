import HeritageLayout from "../components/HeritageLayout";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiCheck, FiX, FiEye, FiUser, FiPackage, FiBarChart2 } from "react-icons/fi";

const Admin = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { role: "admin", username: "Admin" };

  const [activeTab, setActiveTab] = useState("pending"); // pending, history
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "history"
        ? "http://localhost:3001/materials/history?status=history"
        : "http://localhost:3001/materials/pending";

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch materials", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/materials/${id}/approve`, { method: "PUT" });
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
        toast.success("Item approved!");
      }
    } catch (err) { toast.error("Action failed"); }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/materials/${id}/deny`, { method: "PUT" });
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
        toast.info("Item denied.");
      }
    } catch (err) { toast.error("Action failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this item?")) return;
    try {
      const response = await fetch(`http://localhost:3001/materials/${id}`, { method: "DELETE" });
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
        toast.success("Item deleted permanently.");
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "Deletion failed on server.");
      }
    } catch (err) { toast.error("Deletion failed"); }
  };

  return (
    <HeritageLayout>
      <div className="container mx-auto px-6 py-8 animate-fade-in">

        {/* Welcome Header */}
        <div className="mb-10 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-[2.5rem] border border-amber-100 dark:border-slate-700 shadow-sm flex items-center gap-6">
          <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center shadow-lg text-white">
            <FiUser size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Welcome, System Admin <span className="text-amber-600">{user.username}</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 font-medium">Manage platform content, review submissions, and maintain system integrity.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-bold rounded-t-xl transition-all ${activeTab === "pending" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            Pending Reviews
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-bold rounded-t-xl transition-all ${activeTab === "history" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            History & Management
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-bold">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {items.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">No items found in this section.</p>
              </div>
            ) : items.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status === 'pending' ? <FiPackage size={24} /> : item.status === 'approved' ? <FiCheck size={24} /> : <FiX size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.category} • Submitted by {item.username || "Unknown"}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1 max-w-xl">{item.description}</p>
                    {activeTab === 'history' && (
                      <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded ${item.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {activeTab === 'pending' ? (
                    <>
                      <button onClick={() => window.open(`http://localhost:3001/${item.file_path}`, '_blank')} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-bold text-xs uppercase">View</button>
                      <button onClick={() => handleApprove(item.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-xs uppercase shadow-sm">Approve</button>
                      <button onClick={() => handleReject(item.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-xs uppercase shadow-sm">Deny</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => window.open(`http://localhost:3001/${item.file_path}`, '_blank')} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-bold text-xs uppercase">View</button>
                      <button onClick={() => handleDelete(item.id)} className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-bold text-xs uppercase transition-colors">Delete Permanently</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HeritageLayout>
  );
};

export default Admin;

