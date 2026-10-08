import { useState } from "react";
import { FiPlus, FiTrash2, FiSave, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import HeritageLayout from "../components/HeritageLayout";
import Notification from "../components/Notification";

const CreateQuiz = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([
        { type: "multiple_choice", question_text: "", options: ["", "", "", ""], correct_answer: "" }
    ]);
    const [notification, setNotification] = useState(null);

    const addQuestion = () => {
        setQuestions([...questions, { type: "multiple_choice", question_text: "", options: ["", "", "", ""], correct_answer: "" }]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSave = async () => {
        if (!title.trim()) return setNotification({ message: "Please enter a quiz title", type: "error" });
        if (questions.some(q => !q.question_text.trim() || !q.correct_answer.trim())) {
            return setNotification({ message: "Please fill in all questions and answers", type: "error" });
        }

        try {
            const res = await fetch("http://localhost:3001/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teacher_id: user.id,
                    title,
                    description,
                    questions
                })
            });

            if (res.ok) {
                setNotification({ message: "Quiz submitted for approval!", type: "success" });
                setTimeout(() => navigate("/dashboard"), 2000);
            } else {
                setNotification({ message: "Failed to save quiz", type: "error" });
            }
        } catch (err) {
            setNotification({ message: "Network error", type: "error" });
        }
    };

    return (
        <HeritageLayout>
            <div className="max-w-4xl mx-auto space-y-10 animate-fade-in text-left">
                {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 text-white">
                        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Create New Quiz</h1>
                        <p className="opacity-80 font-medium uppercase tracking-widest text-xs">Design assessment material for your students</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-[2rem] border border-amber-200/50 dark:border-slate-700 p-8 space-y-8 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">Quiz Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-6 py-4 bg-stone-50 dark:bg-black/20 rounded-2xl border border-amber-200/50 dark:border-white/10 outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white font-medium"
                                placeholder="e.g. Introduction to Physics"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-6 py-4 bg-stone-50 dark:bg-black/20 rounded-2xl border border-amber-200/50 dark:border-white/10 outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white font-medium"
                                placeholder="Briefly describe the quiz content"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Questions</h3>
                            <button onClick={addQuestion} className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-amber-700 transition shadow-lg">
                                <FiPlus /> Add Question
                            </button>
                        </div>

                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-6 bg-stone-50 dark:bg-white/5 rounded-3xl border border-amber-200/30 dark:border-white/5 relative group animate-slide-up">
                                <button onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-red-100 dark:border-red-900/20">
                                    <FiTrash2 size={16} />
                                </button>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-3">
                                            <label className="block text-[9px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1">Question {qIndex + 1}</label>
                                            <input
                                                type="text"
                                                value={q.question_text}
                                                onChange={(e) => updateQuestion(qIndex, "question_text", e.target.value)}
                                                className="w-full px-4 py-3 bg-white dark:bg-black/20 rounded-xl border border-amber-200/30 dark:border-white/5 outline-none focus:border-amber-500 text-slate-800 dark:text-white text-sm"
                                                placeholder="Enter your question here..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1">Type</label>
                                            <select
                                                value={q.type}
                                                onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                                                className="w-full px-4 py-3 bg-white dark:bg-black/20 rounded-xl border border-amber-200/30 dark:border-white/5 outline-none text-slate-800 dark:text-white text-sm"
                                            >
                                                <option value="multiple_choice">Multiple Choice</option>
                                                <option value="fill_in">Fill in the Blank</option>
                                            </select>
                                        </div>
                                    </div>

                                    {q.type === "multiple_choice" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {q.options.map((opt, oIndex) => (
                                                <div key={oIndex} className="relative">
                                                    <label className="block text-[8px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1">Option {String.fromCharCode(65 + oIndex)}</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-[10px] font-black text-amber-500/40">{String.fromCharCode(65 + oIndex)}</span>
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                            className="w-full pl-8 pr-4 py-2 bg-white dark:bg-black/20 rounded-lg border border-amber-100 dark:border-white/5 outline-none focus:border-amber-400 text-slate-700 dark:text-gray-300 text-xs"
                                                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="md:col-span-2 relative z-20">
                                                <label className="block text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">Correct Answer</label>
                                                <select
                                                    value={q.correct_answer}
                                                    onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                                                    className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200/30 dark:border-green-500/20 outline-none text-green-700 dark:text-green-300 text-sm font-bold cursor-pointer"
                                                >
                                                    <option value="">Select Correct Option</option>
                                                    {q.options.map((opt, i) => opt && <option key={i} value={opt}>Option {String.fromCharCode(65 + i)}: {opt}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">Correct Answer</label>
                                            <input
                                                type="text"
                                                value={q.correct_answer}
                                                onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                                                className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200/30 dark:border-green-500/20 outline-none text-green-700 dark:text-green-300 text-sm font-bold"
                                                placeholder="Enter the exact correct answer"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-amber-100 dark:border-white/10 flex justify-end">
                        <button onClick={handleSave} className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-[2rem] font-bold uppercase tracking-widest text-xs hover:shadow-2xl transition-all shadow-xl active:scale-95">
                            <FiSave size={20} /> Submit Quiz for Approval
                        </button>
                    </div>
                </div>
            </div>
        </HeritageLayout>
    );
};

export default CreateQuiz;
