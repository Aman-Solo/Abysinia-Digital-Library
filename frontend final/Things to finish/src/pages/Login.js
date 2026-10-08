import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import Notification from "../components/Notification";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json();

        // Handle Verification Gating (403 from Backend - Teachers only)
        if (res.status === 403 && data.application_status) {
          if (data.application_status === 'pending_application' || data.application_status === 'none') {
            localStorage.setItem("pendingTeacherEmail", formData.email);
            setNotification({ message: "Please complete your teacher verification to proceed.", type: "info" });
            setTimeout(() => navigate("/teacher-verification"), 2000);
            return;
          }
          if (data.application_status === 'pending') {
            setError("Your application is currently being reviewed by a System Administrator. Please wait for approval.");
            return;
          }
          if (data.application_status === 'rejected') {
            setError("Your application has been rejected.");
            return;
          }
        }

        if (!res.ok) {
          setError(data.message);
        } else {
          localStorage.setItem("user", JSON.stringify(data.user));
          setNotification({ message: `Welcome back, ${data.user.username}! Logging you in...`, type: "success" });
          const targetPath = (data.user.role === 'admin' || data.user.role === 'system_admin' || data.user.role === 'contributor' || data.user.role === 'researcher') ? "/dashboard" : "/home";
          setTimeout(() => navigate(targetPath), 1500); // Delay for notification
        }
      })
      .catch(() => setError("Server error. Try again later."));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.pexels.com/photos/10332309/pexels-photo-10332309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center relative">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Overlay - adjusting for light/dark modes if needed, but keeping dark for contrast with image */}
      <div className="absolute inset-0 bg-amber-900/20 dark:bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700/50 m-4">

        {/* Left Side - Welcome */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-amber-600/90 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"></div>
          <h2 className="text-4xl font-bold mb-6 relative z-10">Welcome Back</h2>
          <p className="text-amber-50 text-lg relative z-10 font-medium leading-relaxed">
            Log in to continue your journey of digital learning and academic excellence at Abyssinia DL.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-900 dark:text-white mb-2">Login</h1>
            <p className="text-amber-800/60 dark:text-gray-300 font-medium text-sm">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-200 p-4 rounded-xl text-sm font-bold border border-red-100 dark:border-red-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-800/60 dark:text-gray-400 uppercase tracking-wide ml-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-amber-600/60 dark:text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-600 rounded-xl text-amber-900 dark:text-white placeholder-amber-900/30 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-amber-800/60 dark:text-gray-400 uppercase tracking-wide ml-1">Password</label>
                <Link to="/forgot-password" class="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wide">Forgot Password?</Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-amber-600/60 dark:text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-600 rounded-xl text-amber-900 dark:text-white placeholder-amber-900/30 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm">
              Sign In <FiArrowRight />
            </button>
          </form>

          <div className="mt-8 text-center text-amber-900/60 dark:text-gray-400 text-sm font-medium">
            Don't have an account? <Link to="/register" className="text-amber-600 font-bold hover:text-amber-700 uppercase tracking-wide text-xs ml-1">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
