import { Link } from "react-router-dom";
import { FiSearch, FiBookmark, FiDownload, FiHeart, FiExternalLink, FiPackage, FiClock, FiUsers, FiChevronRight, FiChevronLeft, FiFileText, FiMusic, FiFilm, FiFile, FiCheckSquare, FiEye } from "react-icons/fi";
import { useEffect, useState } from "react";
import PdfPreview from "../../components/PdfPreview";

const ViewerDashboard = ({ user }) => {
    const [items, setItems] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: "", title: "" });

    const ethiopiaFacts = [
        "Ethiopia is the only African country never to have been colonized.",
        "The oldest human ancestors (Lucy) were discovered in Ethiopia's Afar region.",
        "Ethiopia has its own unique calendar and clock system.",
        "Lalibela features 11 medieval monolithic cave churches carved from rock.",
        "Coffee was originally discovered in Ethiopia's Kaffa region.",
        "The Simien Mountains are home to the rare Gelada baboon and Walia ibex.",
        "Ethiopia is home to 9 UNESCO World Heritage Sites.",
        "The Blue Nile falls are known locally as Tis Abay (Great Smoke)."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentFactIndex(prev => (prev + 1) % ethiopiaFacts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [ethiopiaFacts.length]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3001/items");
                const data = await res.json();
                setItems(data);

                if (user.id) {
                    const bRes = await fetch(`http://localhost:3001/bookmarks/${user.id}`);
                    const bData = await bRes.json();
                    setBookmarks(bData.map(b => b.id));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const handleBookmark = async (itemId) => {
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
        } catch (err) {
            console.error("Bookmark failed", err);
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
            console.error("Download failed", err);
            alert("Failed to download file.");
        }
    };

    const isImage = (ext) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext?.toLowerCase());

    const getFileIcon = (type) => {
        const t = type?.toLowerCase();
        if (['pdf'].includes(t)) return <FiFileText className="text-amber-600 text-5xl opacity-40" />;
        if (['mp3', 'wav', 'ogg'].includes(t)) return <FiMusic className="text-amber-600 text-5xl opacity-40" />;
        if (['mp4', 'webm', 'mov'].includes(t)) return <FiFilm className="text-amber-600 text-5xl opacity-40" />;
        return <FiFile className="text-amber-600 text-5xl opacity-40" />;
    };

    return (
        <div className="space-y-12 animate-fade-in text-left">
            {/* Header Section - Glassy Honey styling with fixed light mode */}
            <div className="glass-panel rounded-3xl shadow-xl p-10 border border-amber-200/40 dark:border-slate-700/40 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-slate-900/40 dark:to-slate-800/40 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h2 className="text-3xl font-bold text-amber-700 dark:text-white mb-4 uppercase tracking-tight">Abyssinia DL - E-Learning Hub</h2>
                <p className="text-slate-700 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed font-medium text-lg tracking-tight">
                    Welcome to your digital learning center. Access a wide range of course materials, textbooks, and interactive lessons.
                    Empowering your education, one click at a time.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link to="/search" className="btn-heritage py-4 text-center flex items-center justify-center gap-3 shadow-amber-600/30 font-bold uppercase tracking-widest text-xs">
                        <FiSearch size={18} /> Browse Courses
                    </Link>
                    <Link to="/bookmarks" className="px-8 py-4 rounded-2xl font-bold border-2 border-amber-300 dark:border-amber-900/40 text-amber-800 dark:text-white hover:bg-amber-100 dark:hover:bg-amber-900/20 transition text-center flex items-center justify-center gap-3 shadow-md uppercase tracking-widest text-xs bg-white/50 dark:bg-transparent">
                        <FiBookmark className="text-amber-600" size={18} /> My Library
                    </Link>
                    <Link to="/quizzes" className="px-8 py-4 rounded-2xl font-bold bg-amber-600 text-white hover:bg-amber-700 transition text-center flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest text-xs">
                        <FiCheckSquare size={18} /> Assessments & Exams
                    </Link>
                </div>
            </div>

            {/* Featured Items Grid */}
            <div>
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-amber-700 dark:text-white uppercase tracking-tight flex items-center gap-4">
                        Latest Materials
                    </h3>
                    <div className="h-0.5 flex-1 bg-amber-200 dark:bg-amber-900/30 mx-8 hidden md:block"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600"></div></div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl border-2 border-dashed border-amber-300/50 dark:border-amber-700/30">
                        <p className="text-amber-800/60 dark:text-amber-400/40 font-bold uppercase tracking-widest text-center text-[10px]">No discoveries unearthed yet...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {items.slice(0, 6).map(item => (
                            <div key={item.id} className="glass-panel rounded-[2.5rem] shadow-xl border border-amber-200/50 dark:border-slate-700 overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800/50 backdrop-blur-md">
                                {/* Thumbnail */}
                                <div className="h-60 bg-stone-100 dark:bg-slate-900 flex items-center justify-center text-amber-700 dark:text-amber-500 font-bold overflow-hidden relative">
                                    {isImage(item.file_type) && item.file_path ? (
                                        <img src={`http://localhost:3001/${item.file_path}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 shadow-inner" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            {getFileIcon(item.file_type)}
                                            <span className="uppercase tracking-[0.3em] text-[10px] text-amber-700/40 dark:text-amber-400/40 font-bold">{item.category || item.file_type}</span>
                                        </div>
                                    )}
                                    {/* Action Overlays */}
                                    <div className="absolute top-5 right-5 flex flex-col gap-3 translate-x-16 group-hover:translate-x-0 transition-transform duration-500">
                                        <button
                                            onClick={() => handleBookmark(item.id)}
                                            className={`p-3.5 bg-white/90 dark:bg-white/20 backdrop-blur-md rounded-2xl shadow-xl transition-all hover:scale-110 ${bookmarks.includes(item.id)
                                                ? "text-amber-500 ring-2 ring-amber-500/30"
                                                : "text-slate-600 dark:text-white hover:text-amber-400"
                                                }`}
                                        >
                                            <FiBookmark size={20} className={bookmarks.includes(item.id) ? "fill-current" : ""} />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(item)}
                                            className="p-3.5 bg-white/90 dark:bg-white/20 backdrop-blur-md rounded-2xl shadow-xl text-slate-600 dark:text-white hover:text-amber-500 transition-all hover:scale-110"
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
                                                className="p-3.5 bg-white/90 dark:bg-white/20 backdrop-blur-md rounded-2xl shadow-xl text-slate-600 dark:text-white hover:text-amber-500 transition-all hover:scale-110"
                                                title={`Preview ${item.file_type.toUpperCase()}`}
                                            >
                                                <FiEye size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 text-left border-t border-amber-100 dark:border-slate-700/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-amber-700 dark:text-white text-xl truncate flex-1 uppercase tracking-tight leading-tight group-hover:text-amber-600 transition-colors">{item.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-[0.2em] mb-4">
                                        {item.category || item.file_type}
                                    </p>
                                    <p className="text-sm text-slate-700 dark:text-gray-400 line-clamp-2 mb-8 leading-relaxed font-medium tracking-tight">"{item.description}"</p>

                                    <div className="pt-6 border-t border-amber-100 dark:border-slate-700/50 flex justify-between items-center">
                                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest"><FiClock className="text-amber-600" /> {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                                        <button className="text-[10px] font-bold text-amber-700 hover:text-amber-600 flex items-center gap-1.5 uppercase tracking-widest group/btn transition-colors">Study Now <FiExternalLink className="group-hover/btn:translate-x-1 transition-transform" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Factual Slider Section - LEFT ALIGNED Container */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group max-w-4xl mr-auto border-2 border-white/10 ring-1 ring-amber-500/30">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-left">
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] mb-4 shadow-sm ring-1 ring-white/10">Learning Tidbits</span>
                        <div className="min-h-[80px] flex items-center transition-all duration-500">
                            <p className="text-xl font-bold leading-tight opacity-95 tracking-tight">
                                "{ethiopiaFacts[currentFactIndex]}"
                            </p>
                        </div>
                        <div className="flex gap-2.5 mt-6 justify-start">
                            {ethiopiaFacts.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentFactIndex(i)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentFactIndex ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <button onClick={() => setCurrentFactIndex(p => (p - 1 + ethiopiaFacts.length) % ethiopiaFacts.length)} className="p-3.5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90 shadow-lg border border-white/10"><FiChevronLeft size={24} /></button>
                        <button onClick={() => setCurrentFactIndex(p => (p + 1) % ethiopiaFacts.length)} className="p-3.5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90 shadow-lg border border-white/10"><FiChevronRight size={24} /></button>
                    </div>
                </div>
            </div>
            <PdfPreview
                isOpen={previewModal.isOpen}
                url={previewModal.url}
                title={previewModal.title}
                onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
            />
        </div>
    );
};

export default ViewerDashboard;
