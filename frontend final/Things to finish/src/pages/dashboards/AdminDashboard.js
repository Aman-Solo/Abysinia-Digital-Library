import { Link } from "react-router-dom";
import { FiUsers, FiClock, FiAlertCircle, FiDownload, FiThumbsUp, FiThumbsDown, FiBookmark, FiArchive, FiPackage, FiCheck, FiX, FiEdit2, FiEye, FiFileText, FiCheckSquare } from "react-icons/fi";
import { useState, useEffect } from "react";
import Notification from "../../components/Notification";
import PdfPreview from "../../components/PdfPreview";
import QuizPreview from "../../components/QuizPreview";

const AdminDashboard = ({ user, historyItems, pendingItems, pendingQuizzes, refreshPending }) => {
    const [bookmarks, setBookmarks] = useState([]);

    // Modal State
    const [rejectModal, setRejectModal] = useState({ open: false, item: null });
    const [editModal, setEditModal] = useState({ open: false, item: null });
    const [rejectReason, setRejectReason] = useState("");
    const [editForm, setEditForm] = useState({ title: "", description: "", category: "" });
    const [notification, setNotification] = useState(null);
    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: "", title: "" });
    const [quizPreview, setQuizPreview] = useState({ isOpen: false, id: null, title: "" });

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:3001/bookmarks/${user.id}`)
                .then(res => res.json())
                .then(data => setBookmarks(data.map(b => b.id)))
                .catch(err => console.error("Could not load bookmarks", err));
        }
    }, [user]);

    const handleBookmark = async (itemId) => {
        if (!user) return;
        const isBookmarked = bookmarks.includes(itemId);
        const url = `http://localhost:3001/bookmarks/${isBookmarked ? 'remove' : 'add'}`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id, item_id: itemId })
            });
            if (res.ok) {
                setBookmarks(prev =>
                    isBookmarked ? prev.filter(id => id !== itemId) : [...prev, itemId]
                );
            }
        } catch (err) { console.error("Bookmark failed", err); }
    };

    const isImage = (ext) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext?.toLowerCase());

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
            link.parentNode.removeChild(link);
        } catch (err) {
            setNotification({ message: "Failed to download file.", type: "error" });
        }
    };

    const openEditModal = (item) => {
        setEditForm({ title: item.title, description: item.description || "", category: item.category || "General" });
        setEditModal({ open: true, item });
    };

    const handleEdit = () => {
        if (editModal.item) {
            fetch(`http://localhost:3001/items/${editModal.item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            }).then(async (res) => {
                if (res.ok) {
                    setEditModal({ open: false, item: null });
                    setNotification({ message: "Metadata updated!", type: "success" });
                    if (refreshPending) refreshPending(editModal.item.id, 'update'); // Just refresh list
                    setTimeout(() => window.location.reload(), 1000);
                }
            });
        }
    };

    const handleApprove = (id) => {
        fetch(`http://localhost:3001/items/${id}/approve`, { method: 'PUT' })
            .then(res => {
                if (res.ok) {
                    setNotification({ message: "Item approved", type: "success" });
                    refreshPending(id, 'approve');
                } else {
                    setNotification({ message: "Failed to approve item", type: "error" });
                }
            });
    };

    const handleReject = () => {
        if (rejectModal.item && rejectReason.trim()) {
            fetch(`http://localhost:3001/items/${rejectModal.item.id}/deny`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rejection_reason: rejectReason.trim() })
            }).then((res) => {
                if (res.ok) {
                    setRejectModal({ open: false, item: null });
                    setRejectReason("");
                    setNotification({ message: "Item rejected", type: "success" });
                    refreshPending(rejectModal.item.id, 'reject');
                } else {
                    setNotification({ message: "Failed to reject item", type: "error" });
                }
            });
        }
    };

    const handleQuizAction = (id, action) => {
        fetch(`http://localhost:3001/quizzes/${id}/${action}`, { method: 'PUT' })
            .then(res => {
                if (res.ok) {
                    setNotification({ message: `Quiz ${action}ed`, type: "success" });
                    window.location.reload();
                }
            });
    };

    const approvedItems = historyItems ? historyItems.filter(i => i.status === 'approved') : [];
    const rejectedItems = historyItems ? historyItems.filter(i => i.status === 'denied') : [];

    return (
        <div className="space-y-10 animate-fade-in text-left">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            {/* Admin Header - Mirroring Contributor Golden Style (Decreased Radius) */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Admin Dashboard</h2>
                        <p className="text-amber-50 text-base font-medium">
                            REVIEW MATERIALS: MODERATE THE LEARNING HUB
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/bookmarks" className="px-8 py-4 bg-white/10 border-2 border-white/20 text-white rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition backdrop-blur-md flex items-center gap-2">
                            <FiBookmark size={18} /> View My Library
                        </Link>
                    </div>
                </div>
            </div>

            <div className="space-y-12 font-medium">
                {/* Pending Content Review - Fixed Light Mode */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-amber-200/40 dark:border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-amber-700 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FiPackage className="text-amber-600 dark:text-amber-400" /> Pending Learning Materials
                    </h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {pendingItems && pendingItems.length > 0 ? pendingItems.map(item => (
                            <div key={item.id} className="p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-amber-200/30 dark:border-white/5 flex items-center justify-between gap-4 transition-all hover:bg-amber-50/50 dark:hover:bg-white/10 shadow-sm">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {isImage(item.file_type) && item.file_path ? (
                                        <div className="relative group/img cursor-pointer" onClick={() => handleDownload(item)}>
                                            <img src={`http://localhost:3001/${item.file_path}`} alt="thumbnail" className="w-16 h-16 rounded-xl object-cover shadow-md border border-amber-200/50 dark:border-white/10" />
                                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                <FiEye className="text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-amber-100/50 dark:bg-white/5 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-500 border border-amber-200/50 dark:border-white/5">
                                            <FiFileText size={24} />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-amber-700 dark:text-white text-sm truncate">{item.title}</h4>
                                        <p className="text-[10px] text-slate-600 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">By {item.username}</p>
                                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-500 rounded text-[9px] font-bold uppercase border border-amber-500/20">{item.category || 'General'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPreviewModal({ isOpen: true, url: `http://localhost:3001/${item.file_path}`, title: item.title })}
                                        className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                                        title="Preview Material"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                    <button onClick={() => openEditModal(item)} className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20" title="Edit Metadata"><FiEdit2 size={18} /></button>
                                    <button onClick={() => handleApprove(item.id)} className="p-2 bg-green-500/10 text-green-600 dark:text-green-500 rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20" title="Approve"><FiCheck size={18} /></button>
                                    <button onClick={() => setRejectModal({ open: true, item })} className="p-2 bg-red-500/10 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20" title="Reject"><FiX size={18} /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 dark:text-gray-500 text-center py-10 text-xs font-bold uppercase">No pending content</p>
                        )}
                    </div>
                </section>

                {/* Pending Quiz Review */}
                <section className="bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-amber-200/40 dark:border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-amber-700 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FiCheckSquare className="text-amber-600 dark:text-amber-400" /> Pending Assessments
                    </h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {pendingQuizzes && pendingQuizzes.length > 0 ? pendingQuizzes.map(quiz => (
                            <div key={quiz.id} className="p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-amber-200/30 dark:border-white/5 flex items-center justify-between gap-4 transition-all hover:bg-amber-50/50 dark:hover:bg-white/10 shadow-sm">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-16 h-16 bg-amber-100/50 dark:bg-white/5 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-500 border border-amber-200/50 dark:border-white/5">
                                        <FiCheckSquare size={24} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-amber-700 dark:text-white text-sm truncate">{quiz.title}</h4>
                                        <p className="text-[10px] text-slate-600 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">By Teacher: {quiz.teacher_name}</p>
                                        <p className="text-[9px] text-slate-500 font-medium italic truncate">"{quiz.description}"</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuizPreview({ isOpen: true, id: quiz.id, title: quiz.title })}
                                        className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                                        title="Preview Quiz"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                    <button onClick={() => handleQuizAction(quiz.id, 'approve')} className="p-2 bg-green-500/10 text-green-600 dark:text-green-500 rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20" title="Approve"><FiCheck size={18} /></button>
                                    <button onClick={() => handleQuizAction(quiz.id, 'deny')} className="p-2 bg-red-500/10 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20" title="Reject"><FiX size={18} /></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 dark:text-gray-500 text-center py-10 text-xs font-bold uppercase">No pending assessments</p>
                        )}
                    </div>
                </section>

                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-amber-700 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <FiArchive className="text-amber-600" /> Review History
                    </h3>
                    <div className="h-0.5 flex-1 bg-amber-200 dark:bg-amber-900/20 mx-6"></div>
                </div>

                {/* 2. Side-by-Side Sections - Fixed Light Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-stone-100 dark:bg-amber-900/5 rounded-3xl p-8 border border-stone-200 dark:border-amber-200/30 flex flex-col h-[500px] shadow-inner">
                        <h4 className="text-[10px] font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <FiThumbsUp /> Approved Items
                        </h4>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {approvedItems.length > 0 ? approvedItems.map(item => (
                                <AdminHistoryItemMinimal key={item.id} item={item} handleDownload={handleDownload} color="green" bookmarks={bookmarks} handleBookmark={handleBookmark} />
                            )) : <p className="text-center text-slate-400 dark:text-gray-400 py-10 text-xs font-bold uppercase tracking-widest">No approved items</p>}
                        </div>
                    </section>

                    <section className="bg-stone-100 dark:bg-amber-900/5 rounded-3xl p-8 border border-stone-200 dark:border-amber-200/30 flex flex-col h-[500px] shadow-inner">
                        <h4 className="text-[10px] font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <FiThumbsDown /> Rejected Items
                        </h4>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {rejectedItems.length > 0 ? rejectedItems.map(item => (
                                <AdminHistoryItemMinimal key={item.id} item={item} handleDownload={handleDownload} color="red" bookmarks={bookmarks} handleBookmark={handleBookmark} />
                            )) : <p className="text-center text-slate-400 dark:text-gray-400 py-10 text-xs font-bold uppercase tracking-widest">No rejected items</p>}
                        </div>
                    </section>
                </div>
            </div>

            {/* Reject Modal */}
            {rejectModal.open && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[500]" onClick={() => setRejectModal({ open: false, item: null })}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-amber-200/40 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-tight">Reject Submission</h3>
                        <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..." className="w-full p-4 bg-stone-50 dark:bg-white/5 border border-amber-200/50 dark:border-white/10 rounded-2xl mb-6 outline-none focus:border-red-500 font-medium h-32 text-slate-800 dark:text-white placeholder:text-slate-400" />
                        <div className="flex gap-4">
                            <button onClick={() => setRejectModal({ open: false, item: null })} className="flex-1 py-3 text-slate-500 font-bold hover:bg-stone-50 dark:hover:bg-slate-800 rounded-xl transition">Cancel</button>
                            <button onClick={handleReject} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg">Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal.open && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[500]" onClick={() => setEditModal({ open: false, item: null })}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-amber-200/40 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-tight">Edit Metadata</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Title</label>
                                <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full p-3 bg-stone-50 dark:bg-white/5 border border-amber-200/50 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Category</label>
                                <input type="text" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full p-3 bg-stone-50 dark:bg-white/5 border border-amber-200/50 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Description</label>
                                <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full p-3 bg-stone-50 dark:bg-white/5 border border-amber-200/50 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 font-medium h-24 text-slate-800 dark:text-white" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setEditModal({ open: false, item: null })} className="flex-1 py-3 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:bg-stone-50 dark:hover:bg-slate-800 rounded-xl transition">Cancel</button>
                            <button onClick={handleEdit} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg uppercase tracking-widest text-[10px]">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Modal content here... */}
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

const AdminHistoryItemMinimal = ({ item, handleDownload, color, bookmarks, handleBookmark }) => (
    <div className="p-4 rounded-xl border border-amber-200/30 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-700 group bg-white dark:bg-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
            <div className="min-w-0 flex-1">
                <h5 className="font-bold text-amber-700 dark:text-white text-sm truncate uppercase tracking-tight">{item.title}</h5>
                <p className="text-[9px] text-slate-600 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {item.status === 'approved' && (
                    <button onClick={() => handleBookmark(item.id)} className={`p-1.5 transition-all hover:scale-110 ${bookmarks.includes(item.id) ? "text-amber-600" : "text-slate-400 dark:text-gray-300 hover:text-amber-500"}`}>
                        <FiBookmark size={16} className={bookmarks.includes(item.id) ? "fill-current" : ""} />
                    </button>
                )}
                <button onClick={() => handleDownload(item)} className="p-1.5 text-slate-400 dark:text-gray-300 hover:text-amber-600 transition-all"><FiDownload size={16} /></button>
                <div className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
        </div>
        {item.status === 'denied' && item.rejection_reason && (
            <div className="mt-3 p-3 bg-red-50/50 dark:bg-red-900/20 rounded-lg border border-red-200/50 dark:border-red-100/10">
                <p className="text-[10px] text-red-700 dark:text-red-400 font-bold uppercase tracking-tight mb-1 flex items-center gap-1.5">
                    <FiAlertCircle size={12} /> Rejection Reason
                </p>
                <p className="text-xs text-red-600/80 dark:text-red-300/80 font-medium leading-relaxed">"{item.rejection_reason}"</p>
            </div>
        )}
    </div>
);

export default AdminDashboard;
