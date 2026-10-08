import { useState, useEffect } from "react";
import { FiSearch, FiBookmark, FiDownload, FiExternalLink, FiClock, FiFilter, FiEye, FiFileText, FiPackage } from "react-icons/fi";
import HeritageLayout from "../components/HeritageLayout";
import PdfPreview from "../components/PdfPreview";

const Search = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [bookmarks, setBookmarks] = useState([]);
    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: "", title: "" });

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const categories = ["All", "General", "Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "Engineering", "Business", "Medicine", "Social Sciences", "Arts"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3001/materials");
                const data = await res.json();
                setItems(data);

                // Read category from URL
                const queryParams = new URLSearchParams(window.location.search);
                const cat = queryParams.get("category");

                let initialResults = data;
                if (cat) {
                    setCategoryFilter(cat);
                    initialResults = data.filter(item => item.category === cat);
                }
                setFilteredItems(initialResults);

                if (user?.id) {
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
    }, [user?.id]);

    const handleSearch = () => {
        let results = items;
        if (searchTerm) {
            results = results.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (categoryFilter !== "All") {
            results = results.filter(item => item.category === categoryFilter);
        }
        setFilteredItems(results);
    };

    const handleBookmark = async (itemId) => {
        if (!user) return alert("Please login to bookmark items.");
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

    return (
        <HeritageLayout>
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-in text-left">
                {/* Search Header - Sleek Golden Sweep with White Text Visibility */}
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-tight">Search Learning Materials</h1>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-7 relative group">
                                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 z-10 shadow-sm" size={20} />
                                <input
                                    type="text"
                                    placeholder="Find lessons, textbooks, exams, and courses..."
                                    className="w-full pl-16 pr-8 py-5 bg-white/10 dark:bg-black/20 rounded-3xl border-2 border-white/20 text-white focus:ring-4 focus:ring-white/10 outline-none transition-all font-medium placeholder:text-white/60 shadow-inner"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <div className="md:col-span-3 relative group">
                                <FiFilter className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 z-10" size={18} />
                                <select
                                    className="w-full pl-14 pr-8 py-5 bg-white/10 dark:bg-black/20 rounded-3xl border-2 border-white/20 text-white focus:ring-4 focus:ring-white/10 outline-none transition-all font-medium appearance-none cursor-pointer shadow-inner"
                                    value={categoryFilter}
                                    onChange={(e) => { setCategoryFilter(e.target.value); handleSearch(); }}
                                >
                                    {categories.map(c => <option key={c} value={c} className="bg-slate-800 text-white">{c}</option>)}
                                </select>
                            </div>

                            <button onClick={handleSearch} className="md:col-span-2 px-4 py-5 bg-white text-amber-900 rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:bg-amber-50 transition shadow-xl active:scale-95 flex items-center justify-center">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Grid - Cohesive Golden Theme with Fixed Light Mode */}
                <div className="space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <FiSearch className="text-amber-600" /> Course Materials ({filteredItems.length})
                        </h2>
                        <div className="h-0.5 flex-1 bg-amber-200 dark:bg-amber-900/20 mx-6"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-20 bg-amber-50/30 dark:bg-amber-900/10 rounded-3xl border-2 border-dashed border-amber-300/50 dark:border-amber-700/30">
                            <p className="text-slate-500 dark:text-gray-400 font-medium text-sm">No items matching your search criteria...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.map(item => (
                                <div key={item.id} className="bg-white dark:bg-slate-800/60 rounded-[2rem] border border-amber-200/50 dark:border-slate-700 overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full">
                                    <div className="h-56 bg-stone-100 dark:bg-slate-900 flex items-center justify-center text-amber-700 font-bold overflow-hidden relative">
                                        {isImage(item.file_type) && item.file_path ? (
                                            <img src={`http://localhost:3001/${item.file_path}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : item.file_type?.toLowerCase() === 'pdf' ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-20 h-24 bg-red-50 dark:bg-red-900/10 rounded-lg border-2 border-red-200 dark:border-red-800/20 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform">
                                                    <FiFileText size={40} className="text-red-500" />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-[9px] font-bold text-center py-1 uppercase tracking-tighter">PDF Document</div>
                                                </div>
                                                <span className="uppercase tracking-[0.3em] text-[8px] font-black text-red-500/40">Verified Material</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 opacity-30">
                                                <FiPackage size={40} className="text-amber-600" />
                                                <span className="uppercase tracking-widest text-[10px] text-slate-600 dark:text-slate-400">{item.file_type || "Resource"}</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleBookmark(item.id)} className={`p-2.5 bg-white rounded-xl shadow-lg transition-all hover:scale-110 ${bookmarks.includes(item.id) ? "text-amber-600" : "text-slate-500 hover:text-amber-500"}`}>
                                                <FiBookmark size={18} className={bookmarks.includes(item.id) ? "fill-current" : ""} />
                                            </button>
                                            <button onClick={() => handleDownload(item)} className="p-2.5 bg-white text-slate-500 hover:text-amber-600 rounded-xl shadow-lg transition-all hover:scale-110"><FiDownload size={18} /></button>
                                            {(item.file_path.toLowerCase().endsWith('.pdf') || isImage(item.file_type)) && (
                                                <button
                                                    onClick={() => setPreviewModal({
                                                        isOpen: true,
                                                        url: `http://localhost:3001/${item.file_path}`,
                                                        title: item.title
                                                    })}
                                                    className="p-2.5 bg-white text-slate-500 hover:text-amber-600 rounded-xl shadow-lg transition-all hover:scale-110"
                                                    title={`Preview ${item.file_type.toUpperCase()}`}
                                                >
                                                    <FiEye size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 text-left flex-1 flex flex-col">
                                        <h3 className="font-bold text-slate-800 dark:text-white text-lg truncate mb-1 uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-3">{item.category}</p>
                                        <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 mb-6 font-medium italic flex-1">"{item.description}"</p>
                                        <div className="pt-4 border-t border-amber-100 dark:border-slate-700 flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1 font-bold"><FiClock className="text-amber-600" /> {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                                            <button className="text-amber-600 hover:text-amber-800 transition-colors font-bold uppercase tracking-wider">Details <FiExternalLink className="inline ml-1" /></button>
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

export default Search;
