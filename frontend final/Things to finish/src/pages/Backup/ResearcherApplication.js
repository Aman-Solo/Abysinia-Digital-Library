import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiUser, FiAward, FiBookOpen, FiArrowLeft } from "react-icons/fi";

const ResearcherApplication = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        credentials: "",
        graduationInfo: ""
    });
    const [idPicture, setIdPicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const email = localStorage.getItem("pendingResearcherEmail");

    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIdPicture(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const submitData = new FormData();
        submitData.append("email", email);
        submitData.append("full_name_app", formData.fullName);
        submitData.append("credentials", formData.credentials);
        submitData.append("graduation_info", formData.graduationInfo);
        submitData.append("id_picture", idPicture);

        try {
            const res = await fetch("http://localhost:3001/user/apply", {
                method: "POST",
                body: submitData
            });

            if (res.ok) {
                setSubmitted(true);
                localStorage.removeItem("pendingResearcherEmail");
            } else {
                const data = await res.json();
                setError(data.message || "Submission failed.");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-cover bg-center py-10 px-4">
                <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center">
                    <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                        <FiBookOpen className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Application Received</h1>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        Thank you for your interest. Please wait until the system admins review your response. You will be able to log in once your application is approved.
                    </p>
                    <button onClick={() => navigate("/login")} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all">
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black py-10 px-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>

            <div className="relative w-full max-w-2xl bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Researcher Credentials</h1>
                    <p className="text-gray-300 text-sm">Please provide additional information for verification.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                                    <FiUser className="text-amber-500" /> Full Name (Legal)
                                </label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500 transition-colors" required />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                                    <FiAward className="text-amber-500" /> Professional Credentials
                                </label>
                                <textarea name="credentials" value={formData.credentials} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500 transition-colors h-24" placeholder="e.g. PhD in History, Museum Curator..." required />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                                    <FiBookOpen className="text-amber-500" /> Educational Background
                                </label>
                                <input type="text" name="graduationInfo" value={formData.graduationInfo} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500 transition-colors" placeholder="Where did you graduate?" required />
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-start gap-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2 w-full text-left flex items-center gap-2">
                                <FiCamera className="text-amber-500" /> ID Picture/Photo
                            </label>
                            <div className="relative group w-full h-64 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden hover:border-amber-500/50 transition-all">
                                {preview ? (
                                    <>
                                        <img src={preview} alt="ID Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => document.getElementById('idUpload').click()}>
                                            <p className="text-white text-xs font-bold uppercase tracking-widest">Change Photo</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center cursor-pointer p-4" onClick={() => document.getElementById('idUpload').click()}>
                                        <FiCamera className="text-3xl text-gray-500 mb-2 mx-auto" />
                                        <p className="text-xs text-gray-400">Click to upload or take a picture of your ID</p>
                                    </div>
                                )}
                                <input type="file" id="idUpload" accept="image/*" className="hidden" onChange={handleFileChange} required />
                            </div>
                            <p className="text-[10px] text-gray-500 text-center italic mt-2">Clear photo of your identity card or official document</p>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                        {loading ? "Submitting Application..." : "Submit Application for Review"}
                    </button>

                    <button type="button" onClick={() => navigate("/login")} className="w-full text-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
                        Cancel and return to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResearcherApplication;
