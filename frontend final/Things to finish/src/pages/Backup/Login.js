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

        // Handle Verification Gating (403 from Backend - Researchers only)
        if (res.status === 403 && data.application_status) {
          if (data.application_status === 'pending_application' || data.application_status === 'none') {
            localStorage.setItem("pendingResearcherEmail", formData.email);
            setNotification({ message: "Please complete your researcher application to proceed.", type: "info" });
            setTimeout(() => navigate("/researcher-application"), 2000);
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
          setTimeout(() => navigate("/dashboard"), 1500); // Delay for notification
        }
      })
      .catch(() => setError("Server error. Try again later."));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.pexels.com/photos/10332309/pexels-photo-10332309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">

        {/* Left Side - Welcome */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-amber-600/90 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-4xl font-bold mb-6 relative z-10">Welcome Back</h2>
          <p className="text-amber-100 text-lg relative z-10">
            Log in to continue preserving and exploring Ethiopia's rich cultural heritage.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
            <p className="text-gray-300">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm backdrop-blur-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                <Link to="/forgot-password" class="text-xs text-amber-400 hover:text-amber-300">Forgot Password?</Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:bg-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2">
              Sign In <FiArrowRight />
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account? <Link to="/register" className="text-amber-400 font-semibold hover:text-amber-300">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
