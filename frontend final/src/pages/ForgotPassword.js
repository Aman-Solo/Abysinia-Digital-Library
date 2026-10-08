import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft, FiKey } from "react-icons/fi";
import Notification from "../components/Notification";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(["", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const handleGetQuestions = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        fetch("http://localhost:3001/auth/get-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data.message) {
                    setError(data.message);
                } else if (data.questions) {
                    setQuestions(data.questions);
                    setStep(2);
                }
            })
            .catch(err => {
                setLoading(false);
                setError("Failed to fetch questions.");
            });
    };

    const handleVerifyAndReset = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        fetch("http://localhost:3001/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                security_answers: answers,
                new_password: newPassword
            })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data.message === "Password reset successfully") {
                    setNotification({ message: "Password reset successfully! Redirecting to login...", type: "success" });
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setError(data.message || "Reset failed");
                }
            })
            .catch(err => {
                setLoading(false);
                setError("Server error.");
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black px-4">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

            <div className="relative w-full max-w-lg bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/10">

                <Link to="/login" className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition text-sm font-medium">
                    <FiArrowLeft className="mr-2" /> Back to Login
                </Link>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400 text-3xl">
                        <FiKey />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Recover Password</h1>
                    <p className="text-gray-300">
                        {step === 1 && "Start by entering your email address."}
                        {step === 2 && "Answer the security questions to verify it's you."}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm backdrop-blur-md mb-6">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleGetQuestions} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-1">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-heritage bg-white/5 border-white/10 text-white placeholder-gray-500 pl-12"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                            {loading ? "Searching..." : "Find Account"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyAndReset} className="space-y-6">
                        <div className="space-y-5 bg-white/5 p-6 rounded-2xl border border-white/10">
                            {questions.map((q, i) => (
                                <div key={i}>
                                    <label className="block text-xs uppercase font-bold text-amber-500 mb-2">{q}</label>
                                    <input
                                        type="text"
                                        value={answers[i]}
                                        onChange={(e) => {
                                            const newAnswers = [...answers];
                                            newAnswers[i] = e.target.value;
                                            setAnswers(newAnswers);
                                        }}
                                        className="input-heritage py-3 text-sm bg-slate-900/50 border-white/10 text-white"
                                        placeholder="Your Answer"
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <label className="block text-gray-300 text-sm font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-heritage bg-white/5 border-white/10 text-white mb-3"
                                required
                            />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-heritage bg-white/5 border-white/10 text-white"
                                placeholder="Confirm New Password"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                            {loading ? "Verifying..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
