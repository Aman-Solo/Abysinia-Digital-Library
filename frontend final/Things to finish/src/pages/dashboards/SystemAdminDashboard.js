import { useState, useEffect } from "react";
import { FiUsers, FiPackage, FiActivity, FiShield, FiTrash2, FiCheck, FiX, FiEye, FiCheckSquare, FiAlertCircle, FiEdit2, FiFileText, FiMessageSquare } from "react-icons/fi";
import Notification from "../../components/Notification";
import PdfPreview from "../../components/PdfPreview";
import QuizPreview from "../../components/QuizPreview";

const SystemAdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalItems: 0 });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewApp, setViewApp] = useState(null);
    const [notification, setNotification] = useState(null);
    const [pendingItems, setPendingItems] = useState([]);
    const [pendingQuizzes, setPendingQuizzes] = useState([]);
    const [messages, setMessages] = useState([]);
    const [viewMessage, setViewMessage] = useState(null);
    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: "", title: "" });
    const [quizPreview, setQuizPreview] = useState({ isOpen: false, id: null, title: "" });
    const [rejectModal, setRejectModal] = useState({ open: false, item: null, type: 'item' });
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [uRes, sRes, aRes, piRes, pqRes, mRes] = await Promise.all([
                fetch("http://localhost:3001/user/all"),
                fetch("http://localhost:3001/user/stats"),
                fetch("http://localhost:3001/user/applications"),
                fetch("http://localhost:3001/items/pending"),
                fetch("http://localhost:3001/quizzes/pending"),
                fetch("http://localhost:3001/contact/all")
            ]);

            if (uRes.ok) setUsers(await uRes.json());
            if (sRes.ok) setStats(await sRes.json());
            if (aRes.ok) setApplications(await aRes.json());
            if (piRes.ok) setPendingItems(await piRes.json());
            if (pqRes.ok) setPendingQuizzes(await pqRes.json());
            if (mRes.ok) setMessages(await mRes.json());
        } catch (err) {
            console.error("Failed to fetch system data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const res = await fetch("http://localhost:3001/user/role", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, role: newRole })
            });
            if (res.ok) {
                setNotification({ message: "User role updated successfully", type: "success" });
                fetchData();
            }
        } catch (err) { setNotification({ message: "Action failed", type: "error" }); }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action is irreversible.")) return;
        try {
            const res = await fetch(`http://localhost:3001/user/${userId}`, { method: "DELETE" });
            if (res.ok) {
                setNotification({ message: "User deleted from system", type: "success" });
                fetchData();
            }
        } catch (err) { setNotification({ message: "Delete failed", type: "error" }); }
    };

    const handleAppAction = async (appId, action) => {
        try {
            const res = await fetch(`http://localhost:3001/user/applications/${appId}/${action}`, { method: "PUT" });
            if (res.ok) {
                setNotification({ message: `Application ${action}ed successfully`, type: "success" });
                if (viewApp?.id === appId) setViewApp(null);
                fetchData();
            }
        } catch (err) { setNotification({ message: "Action failed", type: "error" }); }
    };

    const handleItemAction = async (id, action, reason = "") => {
        const url = `http://localhost:3001/items/${id}/${action}`;
        const options = { method: 'PUT' };
        if (action === 'deny') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify({ rejection_reason: reason });
        }
        try {
            const res = await fetch(url, options);
            if (res.ok) {
                setNotification({ message: `Item ${action}ed`, type: "success" });
                setRejectModal({ open: false, item: null, type: 'item' });
                setRejectReason("");
                fetchData();
            }
        } catch (err) { setNotification({ message: "Action failed", type: "error" }); }
    };

    const handleQuizAction = async (id, action) => {
        try {
            const res = await fetch(`http://localhost:3001/quizzes/${id}/${action}`, { method: 'PUT' });
            if (res.ok) {
                setNotification({ message: `Quiz ${action}ed`, type: "success" });
                fetchData();
            }
        } catch (err) { setNotification({ message: "Action failed", type: "error" }); }
    };

    const handleDeleteMessage = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/contact/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setNotification({ message: "Message deleted", type: "success" });
                if (viewMessage?.id === id) setViewMessage(null);
                fetchData();
            }
        } catch (err) { setNotification({ message: "Delete failed", type: "error" }); }
    };

    const isImage = (ext) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext?.toLowerCase());

    if (loading) return <div className="text-slate-700 dark:text-white text-center py-20">Loading system data...</div>;

    return (
        <div className="space-y-10 animate-fade-in text-left">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Analytics Stats - Removed Large Blue Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <StatCard icon={<FiUsers />} label="Total Registered Users" value={stats.totalUsers} color="bg-blue-500" />
                <StatCard icon={<FiPackage />} label="Course Materials" value={stats.totalItems} color="bg-amber-500" />
                <StatCard icon={<FiActivity />} label="Teacher Applications" value={applications.length} color="bg-purple-500" />
            </div>

            {/* Main Content Grid - Fixed Light Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Researcher Verification */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-indigo-200/40 dark:border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FiActivity className="text-purple-600 dark:text-purple-400" /> Teacher Verification
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {applications.length > 0 ? applications.map(app => (
                            <div key={app.id} className="p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-indigo-200/30 dark:border-white/5 flex items-center justify-between gap-4 transition-all hover:bg-indigo-50/50 dark:hover:bg-white/10 cursor-pointer group" onClick={() => setViewApp(app)}>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{app.full_name_app}</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest">{app.email}</p>
                                </div>
                                <button className="p-2 bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-all"><FiEye size={18} /></button>
                            </div>
                        )) : (
                            <p className="text-slate-500 dark:text-gray-500 text-center py-10 text-xs font-bold uppercase">No pending applications</p>
                        )}
                    </div>
                </section>

                {/* User Management */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-indigo-200/40 dark:border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FiUsers className="text-indigo-600 dark:text-indigo-400" /> User Directory
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {users.map(u => (
                            <div key={u.id} className="p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-indigo-200/30 dark:border-white/5 flex items-center justify-between gap-4 transition-all hover:bg-indigo-50/50 dark:hover:bg-white/10">
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{u.username}</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest">{u.email} • <span className="text-indigo-600 dark:text-indigo-400">{(u.role === 'contributor' || u.role === 'researcher') ? 'Teacher' : u.role === 'viewer' ? 'Student' : u.role === 'system_admin' ? 'System Admin' : u.role}</span></p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                        className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-[10px] font-bold uppercase p-2 rounded-lg outline-none border border-indigo-200/50 dark:border-white/10"
                                    >
                                        <option value="viewer">Student</option>
                                        <option value="contributor">Teacher</option>
                                        <option value="system_admin">System Admin</option>
                                    </select>
                                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" title="Delete User"><FiTrash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pending Materials Review */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-amber-200/40 dark:border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FiPackage className="text-amber-600 dark:text-amber-400" /> Pending Materials
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {pendingItems.length > 0 ? pendingItems.map(item => (
                            <div key={item.id} className="p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-amber-200/30 dark:border-white/5 flex items-center justify-between gap-4 transition-all hover:bg-amber-50/50 dark:hover:bg-white/10 shadow-sm">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {isImage(item.file_type) && item.file_path ? (
                                        <div className="relative group/img cursor-pointer shrink-0" onClick={() => setPreviewModal({ isOpen: true, url: `http://localhost:3001/${item.file_path}`, title: item.title })}>
                                            <img src={`http://localhost:3001/${item.file_path}`} alt="thumb" className="w-12 h-12 rounded-xl object-cover border border-amber-200" />
                                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"><FiEye className="text-white" /></div>
                                        </div>
                                    ) : item.file_type?.toLowerCase() === 'pdf' ? (
                                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 shrink-0 border border-red-200 cursor-pointer" onClick={() => setPreviewModal({ isOpen: true, url: `http://localhost:3001/${item.file_path}`, title: item.title })}>
                                            <FiFileText size={20} />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-amber-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-amber-600 shrink-0"><FiPackage size={20} /></div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-slate-800 dark:text-white text-xs truncate">{item.title}</h4>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">By {item.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPreviewModal({ isOpen: true, url: `http://localhost:3001/${item.file_path}`, title: item.title })} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition" title="Preview"><FiEye size={16} /></button>
                                    <button onClick={() => handleItemAction(item.id, 'approve')} className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition" title="Approve"><FiCheck size={16} /></button>
                                    <button onClick={() => setRejectModal({ open: true, item, type: 'item' })} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition" title="Reject"><FiX size={16} /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-10 text-xs font-bold uppercase">No pending materials</p>
                        )}
                    </div>
                </section>

                {/* Pending Assessments Review */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-purple-200/40 dark:border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FiCheckSquare className="text-purple-600 dark:text-purple-400" /> Pending Assessments
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {pendingQuizzes.length > 0 ? pendingQuizzes.map(quiz => (
                            <div key={quiz.id} className="p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-purple-200/30 dark:border-white/5 flex items-center justify-between gap-4 transition-all hover:bg-purple-50/50 dark:hover:bg-white/10 shadow-sm">
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-slate-800 dark:text-white text-xs truncate uppercase tracking-tight">{quiz.title}</h4>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Teacher: {quiz.teacher_name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setQuizPreview({ isOpen: true, id: quiz.id, title: quiz.title })} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition" title="Preview Quiz"><FiEye size={16} /></button>
                                    <button onClick={() => handleQuizAction(quiz.id, 'approve')} className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition" title="Approve"><FiCheck size={16} /></button>
                                    <button onClick={() => handleQuizAction(quiz.id, 'deny')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition" title="Reject"><FiX size={16} /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-10 text-xs font-bold uppercase">No pending assessments</p>
                        )}
                    </div>
                </section>

                {/* Contact Messages Review */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-blue-200/40 dark:border-white/10 shadow-xl lg:col-span-2">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FiMessageSquare className="text-blue-600 dark:text-blue-400" /> Support Messages & Complaints
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar p-2">
                        {messages.length > 0 ? messages.map(msg => (
                            <div key={msg.id} className="p-5 bg-stone-50 dark:bg-white/5 rounded-2xl border border-blue-200/30 dark:border-white/5 flex flex-col gap-3 transition-all hover:bg-blue-50/50 dark:hover:bg-white/10 shadow-sm relative group">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-slate-800 dark:text-white text-xs truncate uppercase tracking-tight">{msg.subject}</h4>
                                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">{msg.name}</p>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">{new Date(msg.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-gray-400 line-clamp-2 italic">"{msg.message}"</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => setViewMessage(msg)} className="flex-1 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">View Full</button>
                                    <button onClick={() => handleDeleteMessage(msg.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete"><FiTrash2 size={14} /></button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-16 text-center">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">No new messages</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Application Details Modal */}
            {viewApp && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[500] p-4" onClick={() => setViewApp(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-2xl w-full border border-indigo-200/40 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Applicant Details</h3>
                            <button onClick={() => setViewApp(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition"><FiX size={24} /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <Detail label="Full Name" value={viewApp.full_name_app} />
                                <Detail label="Email" value={viewApp.email} />
                                <Detail label="Graduated From" value={viewApp.graduation_info} />
                                <Detail label="Credentials" value={viewApp.credentials} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-2">ID Proof / Photo</p>
                                <img src={`http://localhost:3001/${viewApp.id_picture}`} alt="ID Proof" className="w-full rounded-2xl border border-indigo-200/50 dark:border-white/10 shadow-lg object-contain bg-stone-100 dark:bg-black/20 h-64" />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button onClick={() => handleAppAction(viewApp.id, 'approve')} className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-widest text-xs">Approve Teacher</button>
                            <button onClick={() => handleAppAction(viewApp.id, 'reject')} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-widest text-xs">Reject Application</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Details Modal */}
            {viewMessage && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[500] p-4" onClick={() => setViewMessage(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-lg w-full border border-blue-200/40 dark:border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{viewMessage.subject}</h3>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">From: {viewMessage.name} ({viewMessage.email})</p>
                            </div>
                            <button onClick={() => setViewMessage(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition"><FiX size={20} /></button>
                        </div>
                        <div className="bg-stone-50 dark:bg-white/5 p-6 rounded-2xl border border-blue-100 dark:border-white/5 mb-8">
                            <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed italic">"{viewMessage.message}"</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => window.open(`mailto:${viewMessage.email}?subject=RE: ${viewMessage.subject}`)} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg transition hover:bg-blue-700 uppercase tracking-widest text-[10px]">Reply via Email</button>
                            <button onClick={() => handleDeleteMessage(viewMessage.id)} className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition uppercase tracking-widest text-[10px]">Delete Message</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal.open && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[600] p-4" onClick={() => setRejectModal({ open: false, item: null, type: 'item' })}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-red-200/40 dark:border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-tight">Reject {rejectModal.type === 'item' ? 'Material' : 'Application'}</h3>
                        <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..." className="w-full p-4 bg-stone-50 dark:bg-white/5 border border-red-200/50 dark:border-white/10 rounded-2xl mb-6 outline-none focus:border-red-500 font-medium h-32 text-slate-800 dark:text-white" />
                        <div className="flex gap-4">
                            <button onClick={() => setRejectModal({ open: false, item: null, type: 'item' })} className="flex-1 py-3 text-slate-500 font-bold hover:bg-stone-50 rounded-xl transition">Cancel</button>
                            <button onClick={() => rejectModal.type === 'item' ? handleItemAction(rejectModal.item.id, 'deny', rejectReason) : handleAppAction(rejectModal.item.id, 'reject')} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg">Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            )}

            <PdfPreview
                isOpen={previewModal.isOpen}
                url={previewModal.url}
                title={previewModal.title}
                onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
            />
            <QuizPreview
                isOpen={quizPreview.isOpen}
                quizId={quizPreview.id}
                title={quizPreview.title}
                onClose={() => setQuizPreview({ ...quizPreview, isOpen: false })}
            />
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-indigo-200/40 dark:border-white/10 shadow-xl flex items-center gap-6">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
        </div>
    </div>
);

const Detail = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-slate-800 dark:text-white font-medium">{value}</p>
    </div>
);

export default SystemAdminDashboard;
