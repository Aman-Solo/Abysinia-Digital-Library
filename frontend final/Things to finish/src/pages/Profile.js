import { useState, useEffect } from "react";
import { FiUser, FiMail, FiCalendar, FiUpload, FiCheck, FiEdit2, FiX, FiActivity, FiBriefcase, FiAlertTriangle, FiBookmark, FiArchive, FiDownload, FiExternalLink, FiClock, FiCheckSquare } from "react-icons/fi";
import HeritageLayout from "../components/HeritageLayout";
import Notification from "../components/Notification";

const Profile = () => {
  const getStoredUser = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : { role: "viewer" };
  };

  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user.username || "",
    bio: user.bio || "",
    age: user.age || ""
  });
  const [stats, setStats] = useState({ uploads: 0, approved: 0, pending: 0, bookmarks: 0, rejected: 0 });
  const [userItems, setUserItems] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [notification, setNotification] = useState(null);

  const [activityData, setActivityData] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user.role === 'system_admin') {
          const [uRes, sRes] = await Promise.all([
            fetch("http://localhost:3001/user/all"),
            fetch("http://localhost:3001/user/applications")
          ]);
          const users = await uRes.json();
          const apps = await sRes.json();

          setStats({
            uploads: users.length, // Total Users
            approved: users.filter(u => (u.role === 'contributor' || u.role === 'researcher')).length, // Total Teachers
            pending: apps.length, // Pending Apps
            rejected: 0, // No tracked rejection stat for users easily available unless we fetch elsewhere
            bookmarks: 0
          });
          setActivityData(apps.slice(0, 10).map(a => ({ ...a, activityType: "Verification" }))); // Just show recent apps as activity
        } else if (user.role === 'admin' || user.role === 'researcher') {
          const [pRes, hRes] = await Promise.all([
            fetch('http://localhost:3001/items/pending'),
            fetch('http://localhost:3001/items/history')
          ]);
          const p = await pRes.json();
          const h = await hRes.json();
          setStats({
            uploads: p.length + h.length,
            approved: h.filter(i => i.status === 'approved').length,
            pending: p.length,
            rejected: h.filter(i => i.status === 'denied').length,
            bookmarks: 0
          });
          setActivityData(h.slice(0, 10).map(i => ({ ...i, activityType: "Reviewed" }))); // Recent review logs
        } else {
          const [iRes, bRes] = await Promise.all([
            fetch(`http://localhost:3001/items/user/${user.id}`),
            fetch(`http://localhost:3001/bookmarks/${user.id}`)
          ]);
          const items = await iRes.json();
          const bookmarksData = await bRes.json();

          setUserItems(items);
          setBookmarkedItems(bookmarksData);

          setStats({
            uploads: items.length,
            approved: items.filter(i => i.status === 'approved').length,
            pending: items.filter(i => i.status === 'pending').length,
            rejected: items.filter(i => i.status === 'denied').length,
            bookmarks: bookmarksData.length
          });

          // Fetch Assessment History
          fetch(`http://localhost:3001/quizzes/student/${user.id}`)
            .then(res => res.json())
            .then(data => setAssessmentHistory(data))
            .catch(console.error);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user.id) fetchData();
  }, [user.id, user.role]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, id: user.id })
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsEditing(false);
      setNotification({ message: "Profile Updated Successfully", type: "success" });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setNotification({ message: "Error: " + (data.message || "Update failed"), type: "error" });
    }
  };

  const handleDownload = async (item) => {
    try {
      const response = await fetch(`http://localhost:3001/${item.file_path}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${item.title}.${item.file_path.split('.').pop()}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { setNotification({ message: "Download failed.", type: "error" }); }
  };

  const isImage = (ext) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext?.toLowerCase());

  return (
    <HeritageLayout>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in text-left">
        {/* User Identity Card - Fixed Light Mode Colors */}
        <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-slate-800/20 p-10 rounded-[2.5rem] border border-amber-200/40 dark:border-slate-700/40 backdrop-blur-xl flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 bg-amber-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white/20">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-amber-700 dark:text-white mb-2 uppercase tracking-tight">{user.username}</h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-medium">
                <FiMail className="text-amber-600" /> {user.email}
              </div>
              {user.age && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-medium">
                  <FiCalendar className="text-amber-600" /> {user.age} Years
                </div>
              )}
              <div className="px-4 py-1.5 bg-amber-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                {(user.role === 'contributor' || user.role === 'researcher') ? 'Teacher' : user.role === 'viewer' ? 'Student' : user.role === 'system_admin' ? 'System Admin' : user.role}
              </div>
            </div>
            <p className="text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
              Bio: "{user.bio || (user.role === 'system_admin' ? "Platform administrator ensuring a seamless digital learning experience." : (user.role === 'contributor' || user.role === 'researcher') ? "Dedicated educator committed to sharing knowledge and fostering academic growth." : "Dedicated student dreaming of a brighter future through education.")}"
            </p>
          </div>
          <button onClick={() => { setEditForm({ username: user.username, bio: user.bio || "", age: user.age || "" }); setIsEditing(true); }} className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-amber-600/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 h-fit self-center border border-white/10">
            <FiEdit2 size={16} /> Edit Profile
          </button>
        </div>

        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-amber-950/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-amber-200/40 dark:border-slate-700">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold uppercase tracking-tight text-slate-800 dark:text-white">Edit Identity</h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-red-600 transition"><FiX size={24} /></button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-2">Username</label>
                  <input type="text" value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} className="w-full p-4 bg-amber-50/30 dark:bg-amber-50/10 border border-amber-200 dark:border-amber-900/30 rounded-xl outline-none focus:border-amber-600 transition font-medium text-slate-800 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-2">Age</label>
                  <input type="number" value={editForm.age} onChange={e => setEditForm({ ...editForm, age: e.target.value })} className="w-full p-4 bg-amber-50/30 dark:bg-amber-50/10 border border-amber-200 dark:border-amber-900/30 rounded-xl outline-none focus:border-amber-600 transition font-medium text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-2">Biography</label>
                  <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} className="w-full p-4 bg-amber-50/30 dark:bg-amber-50/10 border border-amber-200 dark:border-amber-900/30 rounded-xl outline-none focus:border-amber-600 transition font-medium h-32 text-slate-800 dark:text-white" />
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-md">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notification Tabs - Role Based */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {user.role === 'viewer' ? (
            <div className="lg:col-start-2 lg:col-span-2">
              <StatBox label="Bookmarks" val={stats.bookmarks} icon={FiBookmark} color="text-amber-600" />
            </div>
          ) : user.role === 'contributor' ? (
            <>
              <StatBox label="Post Approved" val={stats.approved} icon={FiCheck} color="text-green-600" />
              <StatBox label="Post Rejected" val={stats.rejected} icon={FiX} color="text-red-600" />
              <StatBox label="Post Pending" val={stats.pending} icon={FiClock} color="text-yellow-600" />
              <StatBox label="Total Contributions" val={stats.uploads} icon={FiArchive} color="text-amber-600" />
              <div className="lg:col-span-4 mt-2">
                <StatBox label="Bookmark Notifications" val={stats.bookmarks} icon={FiBookmark} color="text-amber-600" />
              </div>
            </>
          ) : user.role === 'system_admin' ? (
            <>
              <StatBox label="Total Users" val={stats.uploads} icon={FiUser} color="text-blue-600" />
              <StatBox label="Researchers" val={stats.approved} icon={FiBriefcase} color="text-purple-600" />
              <StatBox label="Pending Apps" val={stats.pending} icon={FiAlertTriangle} color="text-amber-500" />
              <StatBox label="System Status" val="Active" icon={FiActivity} color="text-green-600" />
            </>
          ) : (
            <>
              <StatBox label="Item Approved" val={stats.approved} icon={FiCheck} color="text-green-600" />
              <StatBox label="Item Rejected" val={stats.rejected} icon={FiX} color="text-red-600" />
              <StatBox label="Review Activity" val={stats.uploads} icon={FiActivity} color="text-blue-600" />
              <StatBox label="Bookmarks" val={stats.bookmarks} icon={FiBookmark} color="text-amber-600" />
            </>
          )}
        </div>

        {/* Recent Activity Feed - Enclosed in a Box */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-amber-700 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
            <FiActivity className="text-amber-600" /> Recent Activity
          </h2>
          <div className="bg-white dark:bg-amber-900/10 p-2 rounded-3xl border border-amber-200/40 dark:border-slate-700/40 shadow-inner overflow-hidden">
            <div className="p-6 space-y-3">
              {loading ? (
                <p className="text-center py-10 text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading history...</p>
              ) : (user.role === 'admin' || user.role === 'researcher' || user.role === 'system_admin') ? (
                activityData && activityData.length > 0 ? activityData.map((item, idx) => <ActivityItemRow key={item.id || idx} item={item} />) : <p className="text-center py-10 text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">No recent reviews found.</p>
              ) : (userItems.length > 0 || bookmarkedItems.length > 0 || (user.role === 'viewer' && assessmentHistory.length > 0)) ? (
                [
                  ...userItems.map(i => ({ ...i, activityType: 'Uploaded' })),
                  ...bookmarkedItems.map(i => ({ ...i, activityType: 'Bookmarked' })),
                  ...assessmentHistory.map(a => ({ ...a, activityType: 'Assessment', title: a.quiz_title || "Quiz Taken", created_at: a.submitted_at }))
                ].sort((a, b) => new Date(b.created_at || b.submitted_at) - new Date(a.created_at || a.submitted_at)).slice(0, 10).map((item, idx) => <ActivityItemRow key={item.id || idx} item={item} />)
              ) : (
                <p className="text-center py-10 text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">No recent activity records.</p>
              )}
            </div>
          </div>
        </div>

        {/* Assessment History for Students */}
        {user.role === 'viewer' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-700 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
              <FiCheckSquare className="text-amber-600" /> Assessment History
            </h2>
            <div className="bg-white dark:bg-amber-900/10 p-2 rounded-3xl border border-amber-200/40 dark:border-slate-700/40 shadow-inner overflow-hidden">
              <div className="p-6 space-y-4">
                {assessmentHistory.length > 0 ? assessmentHistory.map(sub => (
                  <div key={sub.id} className="p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-amber-100/30 flex justify-between items-center transition-all hover:bg-amber-50 group">
                    <div>
                      <h4 className="font-bold text-amber-900 dark:text-white text-sm uppercase tracking-tight mb-1">{sub.quiz_title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(sub.submitted_at).toLocaleDateString()} • {sub.teacher_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-amber-600">{sub.score}%</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score Achieved</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-[10px]">No assessments completed yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </HeritageLayout>
  );
};

const ActivityItemRow = ({ item }) => (
  <div className="p-4 bg-stone-50 dark:bg-amber-900/10 rounded-xl border border-amber-100/30 dark:border-slate-700/30 flex justify-between items-center transition-all hover:bg-amber-100/30 dark:hover:bg-amber-900/20 group">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg 
        ${item.activityType === 'Verification' ? 'bg-blue-100 text-blue-600' :
          item.activityType === 'Assessment' ? 'bg-indigo-100 text-indigo-600' :
            item.status === 'approved' ? 'bg-green-100 text-green-600' :
              item.status === 'denied' ? 'bg-red-100 text-red-600' :
                'bg-amber-100 text-amber-600'}`}>
        {item.activityType === 'Verification' ? <FiUser /> :
          item.activityType === 'Bookmarked' ? <FiBookmark /> :
            item.activityType === 'Assessment' ? <FiCheckSquare /> :
              item.activityType === 'Reviewed' ? <FiActivity /> : <FiArchive />}
      </div>
      <div>
        <p className="text-sm font-bold text-amber-700 dark:text-white truncate max-w-md group-hover:text-amber-600 transition-colors uppercase tracking-tight">
          {item.activityType === 'Verification' ? `Teacher Verification: ${item.full_name_app}` : item.title}
        </p>
        <p className="text-[10px] text-slate-600 dark:text-gray-400 uppercase font-bold tracking-widest mt-0.5">
          {item.activityType} • {item.activityType === 'Assessment' ? `Score: ${item.score || 0}` : (item.status || 'Active')} • {new Date(item.created_at || Date.now()).toLocaleDateString()}
        </p>
      </div>
    </div>
    <button className="text-[10px] text-amber-600 font-bold uppercase tracking-widest hover:underline">Details</button>
  </div>
);

const StatBox = ({ label, val, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-800/40 p-6 rounded-2xl border border-amber-200/50 dark:border-slate-700/50 shadow-sm flex items-center justify-between group h-24 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-amber-50/30 dark:hover:bg-slate-800/60">
    <div>
      <p className="text-[9px] font-bold text-slate-600 dark:text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{val}</p>
    </div>
    <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110`}>
      <Icon size={24} className={color} />
    </div>
  </div>
);

const ProfileContentCard = ({ item, isImage, handleDownload }) => (
  <div className="bg-white dark:bg-slate-800/60 rounded-[1.5rem] overflow-hidden border border-amber-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
    <div className="h-40 bg-stone-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden">
      {isImage(item.file_type) && item.file_path ? (
        <img src={`http://localhost:3001/${item.file_path}`} alt={item.title} className="w-full h-full object-cover" />
      ) : (
        <FiArchive size={30} className="text-amber-600 opacity-20" />
      )}
      <div className="absolute top-3 right-3 flex gap-2">
        <button onClick={() => handleDownload(item)} className="p-2 bg-white/90 rounded-lg shadow-sm text-amber-600 hover:scale-110 transition-transform">
          <FiDownload size={16} />
        </button>
      </div>
      <div className="absolute bottom-3 left-3">
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-white shadow-sm
                    ${item.status === 'approved' ? 'bg-green-500' : item.status === 'denied' ? 'bg-red-500' : 'bg-amber-500'}`}>
          {item.status}
        </span>
      </div>
    </div>
    <div className="p-5 text-left flex-1 flex flex-col">
      <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate mb-1 uppercase tracking-tight">{item.title}</h4>
      <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mb-3">{item.category}</p>
      <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 italic font-medium flex-1">"{item.description}"</p>
    </div>
  </div>
);

export default Profile;
