import HeritageLayout from "../components/HeritageLayout";
import { Link } from "react-router-dom";
import { FiBook, FiBookOpen, FiArrowRight, FiInfo, FiMail, FiPhone, FiMapPin, FiGlobe, FiDatabase, FiUsers } from "react-icons/fi";

const Home = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const categories = [
        { name: "Physics", icon: <FiBookOpen size={40} />, color: "bg-blue-600", description: "Explore the laws of nature, from mechanics to quantum physics." },
        { name: "Chemistry", icon: <FiBookOpen size={40} />, color: "bg-emerald-600", description: "Discover the composition, structure, and properties of matter." },
        { name: "Biology", icon: <FiBookOpen size={40} />, color: "bg-green-600", description: "Study of life and living organisms, from cells to ecosystems." },
        { name: "Mathematics", icon: <FiBookOpen size={40} />, color: "bg-indigo-600", description: "The language of science: calculus, algebra, and geometry." },
        { name: "Computer Science", icon: <FiBookOpen size={40} />, color: "bg-slate-700", description: "Algorithms, programming, and the future of digital technology." },
        { name: "Engineering", icon: <FiBookOpen size={40} />, color: "bg-rose-700", description: "Apply scientific principles to design and build structures and machines." },
        { name: "Medicine", icon: <FiBookOpen size={40} />, color: "bg-red-600", description: "The art and science of healing and maintaining health." },
        { name: "Business", icon: <FiBookOpen size={40} />, color: "bg-amber-600", description: "Economics, management, and the principles of global trade." },
    ];

    return (
        <HeritageLayout>
            <div className="max-w-7xl mx-auto space-y-20 py-10 animate-fade-in text-left">

                {/* Hero Section */}
                <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white min-h-[500px] flex items-center shadow-2xl">
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>

                    <div className="relative z-10 p-12 md:p-20 max-w-3xl">
                        <span className="inline-block px-4 py-1.5 bg-amber-600/20 text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-amber-600/30 backdrop-blur-md">
                            Welcome to the Future of Learning
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-[1.1]">
                            Abyssinia <span className="text-amber-500">DL</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-10 max-w-xl">
                            A premier digital library and e-learning platform dedicated to empowering students and educators through a categorized, high-quality knowledge repository.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/search" className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-amber-600/20 flex items-center gap-2 group active:scale-95">
                                Start Learning <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/register" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-all backdrop-blur-md">
                                Join our Community
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Categories / Library Hub */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tighter">Academic Library</h2>
                            <p className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Select a category to explore specialized materials</p>
                        </div>
                        <div className="h-0.5 flex-1 bg-amber-200 dark:bg-amber-900/30 mx-10 hidden md:block"></div>
                        <FiBook className="text-amber-600 hidden md:block" size={32} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((cat, i) => (
                            <Link
                                key={i}
                                to={`/search?category=${encodeURIComponent(cat.name)}`}
                                className="group relative bg-white dark:bg-slate-800/40 rounded-[2.5rem] p-8 border border-amber-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 ${cat.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity`}></div>

                                <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 ring-4 ring-white dark:ring-slate-900`}>
                                    {cat.icon}
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{cat.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                                    {cat.description}
                                </p>

                                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest pt-4 border-t border-amber-50 dark:border-slate-700">
                                    Browse Library <FiArrowRight />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Website Purpose & About */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-amber-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600"></div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-700 dark:text-amber-400 border border-amber-200/50">
                            <FiInfo size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Our Mission</span>
                        </div>
                        <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tighter leading-tight">
                            Providing a <span className="text-amber-600 underline underline-offset-8 decoration-amber-200 dark:decoration-amber-900/50">Unified Hub</span> for Academic Excellence.
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                            <p>
                                Abyssinia DL was established with a clear objective: to bridge the gap between students and high-quality educational materials. Our platform serves as a centralized repository where educators can share knowledge and students can access curated content across various disciplines.
                            </p>
                            <p>
                                We believe that education should be accessible and organized. By categorizing materials from Physics to Business, we ensure that every learner can find exactly what they need to succeed in their academic journey.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                            <PurposeStat icon={<FiDatabase />} label="Vast Repository" />
                            <PurposeStat icon={<FiUsers />} label="Expert Educators" />
                            <PurposeStat icon={<FiGlobe />} label="Accessible 24/7" />
                            <PurposeStat icon={<FiBook />} label="Quality Content" />
                        </div>
                    </div>

                    {user.role !== 'system_admin' && (
                        <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-[2rem] p-8 border border-amber-200 dark:border-amber-900/30 flex flex-col justify-center space-y-8">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tighter">Contact Us</h3>
                            <div className="space-y-6">
                                <ContactLink icon={<FiMail />} text="support@abyssiniadl.com" label="Email Address" />
                                <ContactLink icon={<FiPhone />} text="+251 911 000 000" label="Phone Number" />
                                <ContactLink icon={<FiMapPin />} text="Addis Ababa, Ethiopia" label="Main Campus Hub" />
                            </div>
                            <Link to="/contact" className="w-full py-4 bg-slate-900 text-white dark:bg-amber-600 text-center rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-amber-700 transition shadow-lg">
                                Go to Contact Page
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </HeritageLayout>
    );
};

const PurposeStat = ({ icon: Icon, label }) => (
    <div className="flex flex-col items-center gap-3 p-4 bg-stone-50 dark:bg-slate-800/20 rounded-2xl border border-amber-100/50 dark:border-slate-800 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/10">
        <div className="text-amber-600 font-bold">{Icon}</div>
        <span className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest">{label}</span>
    </div>
);

const ContactLink = ({ icon: Icon, text, label }) => (
    <div className="flex items-start gap-4">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-amber-600 shadow-sm">{Icon}</div>
        <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-bold text-slate-700 dark:text-white">{text}</p>
        </div>
    </div>
);

export default Home;
