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
          if (formData.role === 'researcher') {
            localStorage.setItem("pendingResearcherEmail", data.email);
            setNotification({ message: "Registration step 1 complete! Please fill out your researcher application.", type: "info" });
            setTimeout(() => navigate("/researcher-application"), 2000);
          } else {
            setNotification({ message: "Registration successful! You can now log in.", type: "success" });
            setTimeout(() => navigate("/login"), 2000);
          }
        }
      })
      .catch(() => setError("Server error. Try again later."));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.pexels.com/photos/2161689/pexels-photo-2161689.jpeg')] bg-cover bg-center py-10">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-2xl bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-300">Join the Archive community today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm backdrop-blur-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-heritage bg-white/5 border-white/10 text-white placeholder-gray-500" required />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-heritage bg-white/5 border-white/10 text-white placeholder-gray-500" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-heritage bg-white/5 border-white/10 text-white placeholder-gray-500" required />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Confirm</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-heritage bg-white/5 border-white/10 text-white placeholder-gray-500" required />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <label className="block text-gray-300 text-sm font-medium mb-1">I want to be a...</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-heritage w-full bg-slate-800 border-white/10 text-white p-3 rounded-xl">
                <option value="viewer">Viewer (Browse only)</option>
                <option value="contributor">Contributor (Upload)</option>
                <option value="researcher">Researcher</option>
              </select>
            </div>
          </div>

          {/* Security Questions */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-amber-400 font-bold mb-4 text-sm uppercase tracking-wider">Security Questions</h3>
            <div className="space-y-4">
              {formData.security_questions.map((q, i) => (
                <div key={i}>
                  <label className="block text-gray-400 text-xs mb-1">{q.question}</label>
                  <input type="text" value={q.answer} onChange={(e) => handleQuestionChange(i, 'answer', e.target.value)} className="input-heritage py-2 bg-slate-900/50 border-white/10 text-white text-sm" placeholder="Your Answer" required />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
            Complete Registration
          </button>
        </form>

        <div className="text-center mt-8">
          <Link to="/login" className="text-gray-400 hover:text-white transition">Already have an account? Login</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
