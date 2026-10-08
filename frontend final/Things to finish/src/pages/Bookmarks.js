import { useState, useEffect } from "react";
import { FiBookmark, FiSearch, FiDownload, FiExternalLink, FiClock, FiTrash2, FiEye } from "react-icons/fi";
import HeritageLayout from "../components/HeritageLayout";
import PdfPreview from "../components/PdfPreview";

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: "", title: "" });
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`http://localhost:3001/bookmarks/${user.id}`);
                const data = await res.json();
                setBookmarks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, [user?.id]);

    const removeBookmark = async (itemId) => {
        try {
            const res = await fetch(`http://localhost:3001/bookmarks/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id, item_id: itemId })
            });
            if (res.ok) {
                setBookmarks(prev => prev.filter(b => b.id !== itemId));
            }
        } catch (err) {
            console.error(err);
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
            link.parentNode.removeChild(link);
        } catch (err) {
            alert("Failed to download file.");
        }
    };

    const isImage = (ext) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext?.toLowerCase());

    if (!user) {
        return (
            <HeritageLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="glass-panel rounded-[2.5rem] p-12 text-center bg-amber-50/30 dark:bg-amber-50/10 border border-amber-200/40 backdrop-blur-xl">
                        <p className="text-slate-600 dark:text-amber-950/60 font-black uppercase tracking-widest italic">Please Login to View Your Bookmarks</p>
                    </div>
                </div>
            </HeritageLayout>
        );
    }

    return (
        <HeritageLayout>
            <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left">
                {/* Bookmarks Header - Fixed Light Mode */}
                <div className="glass-panel rounded-3xl p-10 bg-amber-50/30 dark:bg-amber-900/10 backdrop-blur-2xl relative overflow-hidden border border-amber-200/40 dark:border-amber-200/20 shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-600/5"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-amber-700 dark:text-white mb-4 uppercase tracking-tight">My Library</h1>
                        <p className="text-slate-600 dark:text-amber-100/60 font-bold text-base leading-relaxed">"Your personal collection of learning materials and course references."</p>
                    </div>
                </div>

                {/* Grid - Fixed Light Mode */}
                <div className="space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-amber-700 dark:text-white uppercase tracking-tight flex items-center gap-4">
                            <FiBookmark className="text-amber-600" /> Saved Materials ({bookmarks.length})
                        </h2>
                        <div className="h-0.5 flex-1 bg-amber-200 dark:bg-amber-200/30 mx-8"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>
                    ) : bookmarks.length === 0 ? (
                        <div className="text-center py-24 bg-amber-50/30 dark:bg-amber-50/10 rounded-[2.5rem] border-2 border-dashed border-amber-300/50 dark:border-amber-200/50">
                            <p className="text-slate-500 dark:text-amber-900/40 font-black uppercase tracking-[0.2em] text-xs">Your collection is currently empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {bookmarks.map(item => (
                                <div key={item.id} className="glass-panel rounded-[2.5rem] shadow-lg border border-amber-200/50 dark:border-slate-700/50 overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-800/40 backdrop-blur-sm flex flex-col h-full">
                                    <div className="h-60 bg-stone-100 dark:bg-slate-900 flex items-center justify-center text-amber-700 dark:text-amber-500 font-black overflow-hidden relative">
                                        {isImage(item.file_type) && item.file_path ? (
                                            <img src={`http://localhost:3001/${item.file_path}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <FiBookmark size={40} className="text-amber-600 opacity-30" />
                                                <span className="uppercase tracking-[0.3em] text-[10px] font-black text-slate-500 dark:text-slate-400">{item.file_type}</span>
                                            </div>
                                        )}
                                        <div className="absolute top-5 right-5 flex flex-col gap-3 translate-x-16 group-hover:translate-x-0 transition-transform duration-500">
                                            <button
                                                onClick={() => removeBookmark(item.id)}
                                                className="p-3 bg-red-600/80 backdrop-blur-md rounded-2xl shadow-xl transition-all hover:scale-110 text-white"
                                                title="Remove Bookmark"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(item)}
                                                className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl text-amber-900/40 hover:text-amber-600 transition-all hover:scale-110 shadow-sm"
                                            >
                                                <FiDownload size={20} />
                                            </button>
                                            {(item.file_path.toLowerCase().endsWith('.pdf') || isImage(item.file_type)) && (
                                                <button
                                                    onClick={() => setPreviewModal({
                                                        isOpen: true,
                                                        url: `http://localhost:3001/${item.file_path}`,
                                                        title: item.title
                                                    })}
                                                    className="p-3 bg-amber-500/80 backdrop-blur-md rounded-2xl shadow-xl text-white transition-all hover:scale-110"
                                                    title="Preview Material"
                                                >
                                                    <FiEye size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-8 text-left border-t border-amber-200/50 dark:border-slate-700/50 flex-1 flex flex-col">
                                        <h3 className="font-bold text-amber-700 dark:text-white text-xl truncate mb-1 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-4">
                                            {item.category}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-amber-100/60 line-clamp-3 mb-8 leading-relaxed font-bold flex-1">"{item.description}"</p>
                                        <div className="pt-6 border-t border-amber-200/50 dark:border-amber-100/50 flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                            <span className="flex items-center gap-2 font-bold"><FiClock className="text-amber-600" /> {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                                            <button className="text-amber-700 hover:text-amber-900 flex items-center gap-1.5 transition-colors font-bold">Details <FiExternalLink /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <PdfPreview
                isOpen={previewModal.isOpen}
                url={previewModal.url}
                title={previewModal.title}
                onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
            />
        </HeritageLayout>
    );
};

export default Bookmarks;
