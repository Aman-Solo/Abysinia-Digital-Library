import HeritageLayout from "../components/HeritageLayout";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";

const Contact = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [sending, setSending] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (user.role === 'system_admin') {
            navigate("/dashboard");
        }
    }, [user.role, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message")
        };

        setSending(true);
        try {
            const res = await fetch("http://localhost:3001/contact/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            console.log("Contact Response Status:", res.status);
            const resData = await res.json();
            console.log("Contact Response Data:", resData);

            if (res.ok) {
                setNotification({ message: "Thank you for reaching out! Your message has been sent to our administrators.", type: "success" });
                e.target.reset();
            } else {
                setNotification({ message: resData.message || "Failed to send message. Please try again later.", type: "error" });
            }
        } catch (err) {
            console.error("Contact Submission Error:", err);
            setNotification({ message: "Network error. Please try again.", type: "error" });
        } finally {
            setSending(false);
        }
    };

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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1 bg-amber-600/10 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border border-amber-600/20">
                                Get In Touch
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white tracking-tighter leading-tight">
                                We're here to <span className="text-amber-600">help you</span> succeed.
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">
                                Have questions about our digital library or need technical support? Drop us a message and our team will respond within 24 hours.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ContactCard
                                icon={<FiMail />}
                                title="Email Support"
                                detail="support@abyssiniadl.com"
                                sub="Direct inquiries anytime"
                            />
                            <ContactCard
                                icon={<FiPhone />}
                                title="Phone Line"
                                detail="+251 911 000 000"
                                sub="Mon-Fri, 9am - 6pm"
                            />
                            <ContactCard
                                icon={<FiMapPin />}
                                title="Main Hub"
                                detail="Addis Ababa, Ethiopia"
                                sub="Academic Campus Center"
                            />
                            <ContactCard
                                icon={<FiClock />}
                                title="Response Time"
                                detail="Under 24 Hours"
                                sub="Excluding major holidays"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-10 border border-amber-200/50 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 grayscale pointer-events-none">
                            <FiMessageSquare size={150} />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 uppercase tracking-tighter">Send a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full p-4 bg-amber-50/30 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-600 transition-all font-medium text-slate-800 dark:text-white"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full p-4 bg-amber-50/30 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-600 transition-all font-medium text-slate-800 dark:text-white"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Subject</label>
                                <select name="subject" className="w-full p-4 bg-amber-50/30 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-600 transition-all font-medium text-slate-800 dark:text-white cursor-pointer">
                                    <option>General Inquiry</option>
                                    <option>Technical Support</option>
                                    <option>Contributor Partnership</option>
                                    <option>Report an Issue</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Your Message</label>
                                <textarea
                                    name="message"
                                    className="w-full p-4 bg-amber-50/30 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-600 transition-all font-medium text-slate-800 dark:text-white h-40 resize-none"
                                    placeholder="How can we help you today?"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-5 bg-amber-600 text-white rounded-[2rem] font-bold uppercase tracking-widest text-xs hover:bg-amber-700 transition shadow-xl shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {sending ? "Sending Message..." : <><FiSend /> Send Message Now</>}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </HeritageLayout>
    );
};

const ContactCard = ({ icon, title, detail, sub }) => (
    <div className="p-6 bg-white dark:bg-slate-800/40 rounded-3xl border border-amber-100 dark:border-slate-700 shadow-sm transition-all hover:bg-amber-50 dark:hover:bg-amber-900/10">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 mb-4 shadow-inner">
            {icon}
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-tight">{title}</h4>
        <p className="text-sm font-black text-amber-600 mb-1">{detail}</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub}</p>
    </div>
);

export default Contact;
