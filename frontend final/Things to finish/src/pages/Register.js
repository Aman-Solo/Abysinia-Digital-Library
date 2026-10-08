import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiArrowLeft } from "react-icons/fi";
import Notification from "../components/Notification";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "viewer",
    security_questions: [
      { question: "What is your mother's maiden name?", answer: "" },
      { question: "What was the name of your first pet?", answer: "" },
      { question: "In what city were you born?", answer: "" }
    ]
  });
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.security_questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, security_questions: updatedQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const invalidQuestions = formData.security_questions.some(q => !q.answer.trim());
    if (invalidQuestions) {
      setError("Please fill out all 3 security answers.");
      return;
    }

    fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        security_questions: formData.security_questions
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Registration failed.");
        } else {
          if (formData.role === 'contributor') {
            localStorage.setItem("pendingTeacherEmail", data.email);
            setNotification({ message: "Step 1 complete! Now, please verify your teacher credentials.", type: "info" });
            setTimeout(() => navigate("/teacher-verification"), 2000);
          } else {
            setNotification({ message: "Registration successful! You can now log in.", type: "success" });
            setTimeout(() => navigate("/login"), 2000);
          }
        }
      })
      .catch(() => setError("Server error. Try again later."));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.pexels.com/photos/2161689/pexels-photo-2161689.jpeg')] bg-cover bg-center py-10 relative">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Overlay - Amber/Dark tint */}
      <div className="absolute inset-0 bg-amber-900/20 dark:bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-2xl glass-panel bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/20 dark:border-slate-700/50 m-4">

        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl font-bold text-amber-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-amber-800/60 dark:text-gray-300 font-medium text-sm">Join the Abyssinia DL community today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-200 p-4 rounded-xl text-sm font-bold border border-red-100 dark:border-red-500/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-800/60 dark:text-gray-400 uppercase tracking-wide ml-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-4 text-amber-600/60 dark:text-gray-500" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-600 rounded-xl text-amber-900 dark:text-white placeholder-amber-900/30 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none font-medium" placeholder="John Doe" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-800/60 dark:text-gray-400 uppercase tracking-wide ml-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-amber-600/60 dark:text-gray-500" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-600 rounded-xl text-amber-900 dark:text-white placeholder-amber-900/30 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none font-medium" placeholder="john@example.com" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-800/60 dark:text-gray-400 uppercase tracking-wide ml-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-amber-600/60 dark:text-gray-500" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-600 rounded-xl text-amber-900 dark:text-white placeholder-amber-900/30 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none font-medium" placeholder="••••••••" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-800/60 dark:text-gray-400 uppercase tracking-wide ml-1">Confirm</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-amber-600/60 dark:text-gray-500" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-600 rounded-xl text-amber-900 dark:text-white placeholder-amber-900/30 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none font-medium" placeholder="••••••••" required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-800/60 dark:text-gray-400 uppercase tracking-wide ml-1">I want to be a...</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-4 bg-white/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-600 rounded-xl text-amber-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 outline-none font-medium transition cursor-pointer">
              <option value="viewer">Student (View and Learn)</option>
              <option value="contributor">Teacher (Upload & Verify)</option>
            </select>
          </div>

          {/* Security Questions */}
          <div className="bg-amber-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-amber-100/50 dark:border-slate-700/50">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-4">Security Questions</h3>
            <div className="space-y-4">
              {formData.security_questions.map((q, i) => (
                <div key={i} className="space-y-1">
                  <label className="block text-xs font-bold text-amber-800/60 dark:text-gray-400 uppercase tracking-wide">{q.question}</label>
                  <input type="text" value={q.answer} onChange={(e) => handleQuestionChange(i, 'answer', e.target.value)} className="w-full p-3 bg-white/60 dark:bg-slate-900/50 border border-amber-100/50 dark:border-slate-700 rounded-lg text-amber-900 dark:text-white text-sm focus:border-amber-500 outline-none transition" placeholder="Your Answer" required />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all transform active:scale-95 uppercase tracking-wide text-sm flex items-center justify-center gap-2">
            Complete Registration
          </button>
        </form>

        <div className="text-center mt-8 text-amber-900/60 dark:text-gray-400 text-sm font-medium">
          <Link to="/login" className="hover:text-amber-600 transition flex items-center justify-center gap-2">
            <FiArrowLeft /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
