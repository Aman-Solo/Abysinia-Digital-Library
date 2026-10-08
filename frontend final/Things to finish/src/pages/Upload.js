import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUpload, FiArrowLeft, FiImage, FiType, FiFileText, FiCheck } from "react-icons/fi";
import HeritageLayout from "../components/HeritageLayout";
import Notification from "../components/Notification";

const Upload = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const [notification, setNotification] = useState(null);

    // STRICT REDIRECT: Block Viewers and Admins immediately
    useEffect(() => {
        if (!user || user.role !== 'contributor') {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({ title: "", description: "", category: "General" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    const categories = ["General", "Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "Engineering", "Business", "Medicine", "Social Sciences", "Arts"];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file || !formData.title || !user) return;

        setLoading(true);
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("media", file);
        data.append("user_id", user.id);

        fetch("http://localhost:3001/items", {
            method: "POST",
            body: data,
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Upload Failed");
                return res.json();
            })
            .then(() => {
                setNotification({ message: "Upload Successful! Pending Admin Approval.", type: "success" });
                setTimeout(() => navigate("/dashboard"), 2000);
            })
            .catch((err) => {
                console.error(err);
                setNotification({ message: "Failed to upload. Please try again.", type: "error" });
                setLoading(false);
            });
    };

    if (!user || user.role !== 'contributor') return null;

    return (
        <HeritageLayout>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="max-w-6xl mx-auto py-12 animate-fade-in text-left">
                {/* Header Section */}
                <div className="glass-panel rounded-3xl shadow-lg overflow-hidden border border-amber-200/40 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl mb-12">
                    <div className="bg-gradient-to-br from-amber-600 to-orange-700 px-10 py-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Upload Course Material</h1>
                            <p className="text-amber-50 text-sm">Empower students through knowledge. Share your learning materials today.</p>
                        </div>
                    </div>

                    <div className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-amber-500 uppercase tracking-widest mb-2">Material Title</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-amber-50/30 dark:bg-slate-950/20 border-2 border-amber-200/50 dark:border-slate-800 rounded-2xl outline-none focus:border-amber-600 transition-all font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                                            placeholder="e.g., Computer Science 101 - Intro to Programming"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-amber-500 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            className="w-full p-4 bg-amber-50/30 dark:bg-slate-950/20 border-2 border-amber-200/50 dark:border-slate-800 rounded-2xl outline-none focus:border-amber-600 transition-all font-medium text-slate-800 dark:text-white cursor-pointer"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-amber-500 uppercase tracking-widest mb-2">Course Description</label>
                                        <textarea
                                            className="w-full p-4 bg-amber-50/30 dark:bg-slate-950/20 border-2 border-amber-200/50 dark:border-slate-800 rounded-2xl outline-none focus:border-amber-600 transition-all font-medium text-slate-800 dark:text-white h-40 resize-none placeholder:text-slate-400"
                                            placeholder="Provide overview, syllabus, or learning objectives..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-amber-500 uppercase tracking-widest mb-2">Digital File (Media)</label>
                                    <div className={`relative min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center transition-all group overflow-hidden ${file ? 'border-amber-600 bg-amber-50/10' : 'border-amber-200 hover:border-amber-500'}`}>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                                            required
                                        />

                                        {preview ? (
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <img src={preview} alt="Preview" className="max-h-80 rounded-xl shadow-lg object-contain" />
                                            </div>
                                        ) : file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) ? (
                                            <div className="relative z-10 space-y-4 animate-bounce-in">
                                                <div className="w-24 h-32 bg-red-50 dark:bg-red-900/10 rounded-xl flex flex-col items-center justify-center mx-auto shadow-2xl shadow-red-500/10 border-2 border-red-200 dark:border-red-900/30 relative overflow-hidden">
                                                    <FiFileText size={48} className="text-red-600 dark:text-red-400" />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[9px] font-bold text-center py-1.5 uppercase tracking-widest">PDF DOC</div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white max-w-[200px] truncate mx-auto">{file.name}</p>
                                                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] mt-2">Ready to contribute</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative z-10 space-y-3">
                                                <div className="w-16 h-16 bg-amber-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                                    <FiUpload size={30} className="text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">Click or Drag to Upload</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Images, PDFs, Audio, or Video</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col md:flex-row gap-4 border-t border-amber-100 dark:border-slate-800">
                                <Link to="/dashboard" className="flex-1 py-4 rounded-2xl border-2 border-amber-200 text-slate-700 font-bold text-center hover:bg-amber-50 transition-all flex items-center justify-center gap-2">
                                    <FiArrowLeft size={18} /> Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-4 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? "Uploading..." : <><FiCheck size={18} /> Submit course material</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </HeritageLayout>
    );
};

export default Upload;
