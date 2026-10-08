import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FiUpload, FiUser, FiAlertCircle, FiCheckCircle, FiClock, FiDownload,
    FiArchive, FiThumbsUp, FiThumbsDown, FiFileText, FiMusic, FiFilm, FiFile, FiBookmark, FiExternalLink, FiEye, FiCheckSquare
} from "react-icons/fi";
import PdfPreview from "../../components/PdfPreview";
import QuizPreview from "../../components/QuizPreview";

const ContributorDashboard = ({ user, userItems, teacherQuizzes, loading }) => {
    const [bookmarks, setBookmarks] = useState([]);
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

    const getFileIcon = (type) => {
        const t = type?.toLowerCase();
        if (['pdf'].includes(t)) return <FiFileText size={40} className="text-amber-600 opacity-40" />;
        if (['mp3', 'wav', 'ogg'].includes(t)) return <FiMusic size={40} className="text-amber-600 opacity-40" />;
        if (['mp4', 'webm', 'mov'].includes(t)) return <FiFilm size={40} className="text-amber-600 opacity-40" />;
        return <FiFile size={40} className="text-amber-600 opacity-40" />;
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
        } catch (err) { alert("Failed to download file."); }
    };

    const pendingItems = userItems.filter(i => i.status === 'pending');
    const approvedItems = userItems.filter(i => i.status === 'approved');
    const rejectedItems = userItems.filter(i => i.status === 'denied');

    return (
        <div className="space-y-10 animate-fade-in text-left">
            {/* Contributor Header - Golden Search Style (Decreased Border Radius) */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Teacher</h2>
                        <p className="text-amber-50 text-base font-medium">
                            EDUCATE THE FUTURE: SHAPE THE MINDS OF TOMORROW
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/upload" className="px-8 py-4 bg-white text-amber-950 rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:bg-amber-50 transition shadow-xl active:scale-95 flex items-center gap-2">
                            <FiUpload size={18} /> Upload Material
                        </Link>
                        <Link to="/bookmarks" className="px-8 py-4 bg-white/10 border-2 border-white/20 text-white rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition backdrop-blur-md flex items-center gap-2">
                            <FiBookmark size={18} /> View My Library
                        </Link>
                        <Link to="/create-quiz" className="px-8 py-4 bg-amber-100 text-amber-900 rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:bg-white transition flex items-center gap-2 shadow-lg">
                            <FiCheckSquare size={18} /> Create New Quiz
                        </Link>
                    </div>
                </div>
            </div>

            <div className="space-y-12 font-medium">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-amber-700 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <FiArchive className="text-amber-600" /> Material History
                    </h3>
                    <div className="h-0.5 flex-1 bg-amber-200 dark:bg-amber-900/20 mx-6"></div>
                </div>

                {/* 1. Pending Items */}
                <section className="bg-amber-50/30 dark:bg-amber-900/5 rounded-3xl p-8 border border-amber-200/40 dark:border-amber-200/20 backdrop-blur-sm">
                    <h4 className="text-[10px] font-bold text-slate-700 dark:text-amber-500 mb-6 flex items-center gap-2 uppercase tracking-widest">
                        <FiClock /> Pending Items
                    </h4>
                    <div className="space-y-4">
                        {pendingItems.length > 0 ? pendingItems.map(item => (
                            <div key={item.id} className="p-4 bg-white dark:bg-amber-900/10 rounded-2xl border border-amber-200/30 dark:border-amber-100/10 shadow-sm transition-all hover:bg-amber-50/50 dark:hover:bg-amber-900/20 group cursor-default">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {isImage(item.file_type) && item.file_path ? (
                                            <img src={`http://localhost:3001/${item.file_path}`} alt="item" className="w-12 h-12 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105" />
                                        ) : (
                                            <div className="w-12 h-12 bg-amber-100/50 dark:bg-amber-100/30 rounded-xl flex items-center justify-center text-amber-600">{getFileIcon(item.file_type)}</div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-amber-700 dark:text-white text-sm truncate uppercase tracking-tight transition-colors group-hover:text-amber-600">{item.title}</h4>
                                            <p className="text-[9px] text-slate-600 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                {item.category} • {new Date(item.created_at || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleDownload(item)} className="p-2 text-slate-400 dark:text-gray-300 hover:text-amber-600 transition-all hover:scale-110"><FiDownload size={18} /></button>
                                        {(item.file_path.toLowerCase().endsWith('.pdf') || isImage(item.file_type)) && (
                                            <button
                                                onClick={() => setPreviewModal({
                                                    isOpen: true,
                                                    url: `http://localhost:3001/${item.file_path}`,
                                                    title: item.title
                                                })}
                                                className="p-2 text-slate-400 dark:text-gray-300 hover:text-amber-600 transition-all hover:scale-110"
                                                title={`Preview ${item.file_type.toUpperCase()}`}
                                            >
                                                <FiEye size={18} />
                                            </button>
                                        )}
                                        <span className="px-3 py-1 bg-amber-600/10 text-amber-700 text-[10px] font-bold uppercase rounded-full border border-amber-600/20 shadow-sm">
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center py-10 text-slate-400 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">No pending items</p>
                        )}
                    </div>
                </section>

                {/* My Quizzes */}
                <section className="bg-amber-50/30 dark:bg-amber-900/5 rounded-3xl p-8 border border-amber-200/40 dark:border-amber-200/20 backdrop-blur-sm shadow-xl">
                    <h3 className="text-xl font-bold text-amber-700 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                        <FiCheckSquare className="text-amber-600 dark:text-amber-400" /> My Assessments
                    </h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {teacherQuizzes && teacherQuizzes.length > 0 ? teacherQuizzes.map(quiz => (
                            <div key={quiz.id} className="p-4 bg-white dark:bg-amber-900/10 rounded-2xl border border-amber-200/30 dark:border-amber-100/10 shadow-sm transition-all hover:bg-amber-50/50 dark:hover:bg-amber-900/20 group">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 bg-amber-100/50 dark:bg-white/5 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-500">
                                            <FiCheckSquare size={20} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-amber-700 dark:text-white text-sm truncate uppercase tracking-tight">{quiz.title}</h4>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                {new Date(quiz.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuizPreview({ isOpen: true, id: quiz.id, title: quiz.title })}
                                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200/20"
                                            title="Preview Quiz"
                                        >
                                            <FiEye size={16} />
                                        </button>
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${quiz.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                            quiz.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                'bg-red-100 text-red-700 border-red-200'}`}>
                                            {quiz.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 dark:text-gray-500 text-center py-10 text-xs font-bold uppercase">No assessments created yet</p>
                        )}
                    </div>
                </section>

                {/* 2. Side-by-Side Sections - Fixed Light Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-stone-100 dark:bg-amber-900/5 rounded-3xl p-8 border border-stone-200 dark:border-amber-200/30 flex flex-col h-[500px] shadow-inner">
                        <h4 className="text-[10px] font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <FiThumbsUp /> Approved Items
                        </h4>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {approvedItems.length > 0 ? approvedItems.map(item => (
                                <HistoryItemCohesive key={item.id} item={item} handleDownload={handleDownload} color="green" bookmarks={bookmarks} handleBookmark={handleBookmark} setPreviewModal={setPreviewModal} isImage={isImage} />
                            )) : <p className="text-center text-slate-400 dark:text-gray-400 py-10 text-xs font-bold uppercase tracking-widest">No approved items</p>}
                        </div>
                    </section>

                    <section className="bg-stone-100 dark:bg-amber-900/5 rounded-3xl p-8 border border-stone-200 dark:border-amber-200/30 flex flex-col h-[500px] shadow-inner">
                        <h4 className="text-[10px] font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <FiThumbsDown /> Rejected Items
                        </h4>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {rejectedItems.length > 0 ? rejectedItems.map(item => (
                                <HistoryItemCohesive key={item.id} item={item} handleDownload={handleDownload} color="red" bookmarks={bookmarks} handleBookmark={handleBookmark} setPreviewModal={setPreviewModal} isImage={isImage} />
                            )) : <p className="text-center text-slate-400 dark:text-gray-400 py-10 text-xs font-bold uppercase tracking-widest">No rejected items</p>}
                        </div>
                    </section>
                </div>
            </div>
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

const ContributionListItem = ({ item, isImage, getFileIcon, handleDownload }) => (
    <div className="p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-amber-200/50 dark:border-amber-100/50 shadow-sm transition-all hover:bg-amber-50/50 dark:hover:bg-slate-700 group">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {isImage(item.file_type) && item.file_path ? (
                    <img src={`http://localhost:3001/${item.file_path}`} alt="item" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                ) : (
                    <div className="w-12 h-12 bg-amber-100/30 rounded-xl flex items-center justify-center text-amber-600">{getFileIcon(item.file_type)}</div>
                )}
                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate uppercase tracking-tight">{item.title}</h4>
                    <p className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        {item.category} • {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => handleDownload(item)} className="p-2 text-slate-400 dark:text-gray-300 hover:text-amber-600 transition-colors"><FiDownload size={18} /></button>
                <span className="px-3 py-1 bg-amber-600/10 text-amber-700 text-[10px] font-bold uppercase rounded-full border border-amber-600/20">
                    {item.status}
                </span>
            </div>
        </div>
    </div>
);

const HistoryItemCohesive = ({ item, handleDownload, color, bookmarks, handleBookmark, setPreviewModal, isImage }) => (
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
                {(item.file_path.toLowerCase().endsWith('.pdf') || isImage(item.file_type)) && (
                    <button
                        onClick={() => setPreviewModal({
                            isOpen: true,
                            url: `http://localhost:3001/${item.file_path}`,
                            title: item.title
                        })}
                        className="p-1.5 text-slate-400 dark:text-gray-300 hover:text-amber-600 transition-all"
                        title={`Preview ${item.file_type.toUpperCase()}`}
                    >
                        <FiEye size={16} />
                    </button>
                )}
                <div className={`w-2.5 h-2.5 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}></div>
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

export default ContributorDashboard;
