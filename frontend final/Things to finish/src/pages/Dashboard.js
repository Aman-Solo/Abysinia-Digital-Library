import HeritageLayout from "../components/HeritageLayout";
import { Link, useNavigate } from "react-router-dom";
import { FiUpload, FiPackage } from "react-icons/fi";
import { useState, useEffect } from "react";

// Import separate dashboards
import ViewerDashboard from "./dashboards/ViewerDashboard";
import ContributorDashboard from "./dashboards/ContributorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import SystemAdminDashboard from "./dashboards/SystemAdminDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  // Get user from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { role: "viewer" };
  const [userItems, setUserItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [pendingQuizzes, setPendingQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [teacherQuizzes, setTeacherQuizzes] = useState([]);

  useEffect(() => {
    if (user.role === "contributor" && user.id) {
      setLoading(true);
      fetch(`http://localhost:3001/items/user/${user.id}`)
        .then(res => res.json())
        .then(data => { setUserItems(data); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    } else if (user.role === 'admin' || user.role === 'researcher') {
      const fetchAdminData = () => {
        fetch(`http://localhost:3001/items/pending`)
          .then(res => res.json())
          .then(data => setPendingItems(data))
          .catch(console.error);

        fetch(`http://localhost:3001/quizzes/pending`)
          .then(res => res.json())
          .then(data => setPendingQuizzes(data))
          .catch(console.error);

        fetch(`http://localhost:3001/items/history?status=history`)
          .then(res => res.json())
          .then(data => setHistoryItems(data))
          .catch(console.error);
      };
      fetchAdminData();
      window.refreshAdminDashboard = fetchAdminData;
    }

    if (user.role === 'contributor' && user.id) {
      fetch(`http://localhost:3001/quizzes/teacher/${user.id}`)
        .then(res => res.json())
        .then(data => setTeacherQuizzes(data))
        .catch(console.error);
    }
  }, [user.id, user.role]);

  const refreshPending = (id, action) => {
    setPendingItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <HeritageLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-6">
          {/* Welcome Header - Fixed Role Reflection - Hidden for System Admin */}
          {user.role !== 'system_admin' && (
            <div className="mb-8 px-2 text-left">
              <h1 className="text-xl font-bold text-amber-600 leading-tight uppercase tracking-tight">
                Dashboard <span className="text-slate-800 dark:text-white font-medium ml-2">/ {user.role === 'admin' ? 'Administrator' : (user.role === 'contributor' || user.role === 'researcher') ? 'Teacher' : user.role === 'system_admin' ? 'System Admin' : 'Student'}</span>
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mt-1 uppercase tracking-widest">Welcome back, {user.username ? user.username.replace(/([A-Z])/g, ' $1').trim() : "User"}</p>
            </div>
          )}

          <div className="space-y-12">
            {/* Conditional Rendering based on Role */}
            {user.role === 'viewer' && <ViewerDashboard user={user} />}
            {user.role === 'contributor' && <ContributorDashboard user={user} userItems={userItems} teacherQuizzes={teacherQuizzes} loading={loading} />}
            {(user.role === 'admin' || user.role === 'researcher') && <AdminDashboard user={user} pendingItems={pendingItems} pendingQuizzes={pendingQuizzes} historyItems={historyItems} refreshPending={refreshPending} />}
            {user.role === 'system_admin' && <SystemAdminDashboard />}
          </div>

        </div>
      </div>
    </HeritageLayout>
  );
};


export default Dashboard;
