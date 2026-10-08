import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiMoon, FiSun, FiUser, FiVolume2 } from "react-icons/fi";
import LanguageSwitcher from "./LanguageSwitcher";
import Footer from "./Footer";

const HeritageLayout = ({ children }) => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved ? JSON.parse(saved) : false;
    });
    const dropdownRef = useRef(null);

    const userString = localStorage.getItem("user");
    const storedUser = userString ? JSON.parse(userString) : null;

    const currentUser = storedUser
        ? {
            ...storedUser,
            name: storedUser.username || storedUser.email || "User",
            role: storedUser.role || "viewer",
        }
        : {
            name: "Guest User",
            role: "viewer",
        };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: "Home", path: "/home", visible: true },
        { name: "Dashboard", path: "/dashboard", visible: !!currentUser.id },
        { name: "Material Upload", path: "/upload", visible: currentUser.role === 'contributor' },
        { name: "Search", path: "/search", visible: true },
        { name: "Contact", path: "/contact", visible: currentUser.role !== "system_admin" },
        { name: "Profile", path: "/profile", visible: !!currentUser.id },
        /*{ name: "Admin", path: "/admin", visible: currentUser.role === "admin" || currentUser.role === "system_admin" },*/
    ];

    const initials = currentUser.name && currentUser.name !== "Guest User"
        ? currentUser.name.charAt(0).toUpperCase()
        : "G";

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setUserOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    // Read Aloud function trick for the edge read aloud
    const handleReadAloud = () => {

        const event = new KeyboardEvent('keydown', {
            key: 'u',
            code: 'KeyU',
            keyCode: 85,
            which: 85,
            ctrlKey: true,
            shiftKey: true,
            bubbles: true
        });
        document.dispatchEvent(event);

        // Alternative: Use Web Speech API as fallback if all fails
        if ('speechSynthesis' in window) {

            const mainContent = document.querySelector('main');
            if (mainContent) {
                const text = mainContent.innerText.substring(0, 5000);
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1;
                utterance.pitch = 1;

                // Toggle speech
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                } else {
                    window.speechSynthesis.speak(utterance);
                }
            }
        }
    };

    const weavePattern = `data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a373' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

    return (
        <div className={`flex flex-col min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-stone-50"}`}>

            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `url("${weavePattern}")`,
                    opacity: darkMode ? 0.03 : 0.06
                }}
            />

            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-sm transition-all ${darkMode ? "bg-slate-800/90 border-slate-700/50" : "bg-white/80 border-stone-200/50"}`}>
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">

                    <Link to="/home" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-orange-900 rounded-xl rotate-3 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-0 transition-all duration-300 border border-amber-600/30">
                            DL
                        </div>
                        <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r hidden sm:block font-serif tracking-tight ${darkMode ? "from-white to-stone-300" : "from-gray-900 to-stone-600"}`}>
                            Abyssinia DL
                        </span>
                    </Link>

                    <div className="hidden md:flex flex-1 justify-center">
                        <LanguageSwitcher />
                    </div>

                    <div className="hidden md:flex items-center gap-6 justify-end">

                        {navLinks.filter(l => l.visible).map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-medium text-sm tracking-wide transition-all px-3 py-2 rounded-lg ${isActive(link.path)
                                    ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                    : darkMode
                                        ? "text-gray-300 hover:text-amber-400"
                                        : "text-gray-700 hover:text-amber-700"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className={`h-6 w-px mx-1 ${darkMode ? "bg-slate-700" : "bg-stone-300"}`}></div>

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2.5 rounded-full transition-colors ${darkMode ? "hover:bg-slate-700 text-stone-300" : "hover:bg-stone-100 text-stone-600"}`}
                            title="Toggle Theme"
                        >
                            {darkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
                        </button>

                        {currentUser.id && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setUserOpen(!userOpen)}
                                    className={`w-11 h-11 rounded-full bg-gradient-to-br from-amber-600 to-orange-800 text-white flex items-center justify-center font-bold shadow-md hover:shadow-amber-600/40 transition-all ring-2 ${darkMode ? "ring-slate-700" : "ring-white"}`}
                                >
                                    {initials}
                                </button>

                                {userOpen && (
                                    <div className={`absolute right-0 mt-4 w-60 rounded-2xl shadow-xl overflow-hidden glass-panel ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-stone-100"}`}>
                                        <div className={`px-5 py-4 border-b ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-stone-100 bg-stone-50/50"}`}>
                                            <p className={`text-sm font-bold truncate ${darkMode ? "text-white" : "text-gray-800"}`}>{currentUser.name}</p>
                                            <p className={`text-xs truncate capitalize ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Role: {currentUser.role === 'contributor' || currentUser.role === 'researcher' ? 'Teacher' : currentUser.role === 'viewer' ? 'Student' : currentUser.role === 'system_admin' ? 'System Admin' : currentUser.role}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setUserOpen(false)}
                                            className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${darkMode ? "text-gray-200 hover:bg-slate-700/50" : "text-gray-700 hover:bg-amber-50"}`}
                                        >
                                            <FiUser className="text-amber-600" /> My Profile
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setUserOpen(false);
                                                localStorage.removeItem("user");
                                                window.location.href = "/login";
                                            }}
                                            className={`w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-red-600 transition-colors ${darkMode ? "hover:bg-red-900/10" : "hover:bg-red-50"}`}
                                        >
                                            <FiLogOut /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`md:hidden text-2xl ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                    >
                        {mobileOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                        } ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-stone-100"} border-t shadow-lg`}
                >
                    <div className="p-6 space-y-6">
                        <div className="flex justify-center pb-2">
                            <LanguageSwitcher />
                        </div>

                        <div className="space-y-2">
                            {navLinks.filter(l => l.visible).map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-center font-medium ${isActive(link.path)
                                        ? darkMode
                                            ? "bg-slate-800 text-amber-400"
                                            : "bg-amber-50 text-amber-700"
                                        : darkMode
                                            ? "text-gray-300 bg-slate-800/50"
                                            : "text-gray-700 bg-gray-50"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {currentUser.id && (
                            <>
                                <div className={`border-t pt-6 flex items-center justify-between px-2 ${darkMode ? "border-slate-800" : "border-stone-100"}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">{initials}</div>
                                        <div>
                                            <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{currentUser.name}</p>
                                            <p className={`text-xs capitalize ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{(currentUser.role === 'contributor' || currentUser.role === 'researcher') ? 'Teacher' : currentUser.role === 'viewer' ? 'Student' : currentUser.role === 'system_admin' ? 'System Admin' : currentUser.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`p-3 rounded-full ${darkMode ? "bg-slate-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}
                                    >
                                        {darkMode ? <FiSun /> : <FiMoon />}
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        localStorage.removeItem("user");
                                        window.location.href = "/login";
                                    }}
                                    className={`w-full text-center py-4 text-sm font-bold text-red-600 rounded-xl ${darkMode ? "bg-red-900/10" : "bg-red-50"}`}
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-grow px-4 py-8 relative z-10">
                {children}
            </main>

            {/* Read Aloud Button */}
            <button
                onClick={handleReadAloud}
                className="read-aloud-btn"
                title="Read Aloud (Ctrl+Shift+U for Edge)"
                aria-label="Read page content aloud"
            >
                <FiVolume2 size={24} />
            </button>

            <Footer />
        </div>
    );
};

export default HeritageLayout;
