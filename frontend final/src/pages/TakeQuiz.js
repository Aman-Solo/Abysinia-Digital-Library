import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiClock, FiCheckSquare, FiAlertCircle, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import HeritageLayout from "../components/HeritageLayout";
import Notification from "../components/Notification";

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/quizzes/${id}`)
            .then(res => res.json())
            .then(data => {
                const parsedQuestions = data.questions.map(q => ({
                    ...q,
                    options: q.options ? JSON.parse(q.options) : []
                }));
                setQuiz({ ...data, questions: parsedQuestions });
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleAnswer = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async () => {
        let correctCount = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id]?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()) {
                correctCount++;
            }
        });

        const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
        setScore(finalScore);

        try {
            const res = await fetch("http://localhost:3001/quizzes/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: user.id,
                    quiz_id: id,
                    answers,
                    score: finalScore
                })
            });

            if (res.ok) {
                setFinished(true);
            } else {
                setNotification({ message: "Failed to submit quiz", type: "error" });
            }
        } catch (err) {
            setNotification({ message: "Network error", type: "error" });
        }
    };

    if (loading) return <HeritageLayout><div className="flex justify-center py-40 animate-pulse text-amber-600 font-bold uppercase tracking-widest">Prepairing Assessment...</div></HeritageLayout>;

    if (finished) {
        return (
            <HeritageLayout>
                <div className="max-w-2xl mx-auto space-y-10 animate-fade-in text-center py-20">
                    <div className="bg-white dark:bg-slate-800/60 rounded-[3rem] border-2 border-amber-200/50 dark:border-slate-700 p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-600 shadow-inner">
                            <FiCheckSquare size={40} />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-tighter">Assessment Complete</h1>
                        <p className="text-lg text-slate-600 dark:text-gray-400 font-medium mb-12">Congratulations! You've finished <span className="text-amber-600 font-bold">"{quiz.title}"</span></p>

                        <div className="bg-stone-50 dark:bg-black/20 rounded-3xl p-10 border border-amber-100 dark:border-white/5 mb-10">
                            <p className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-2">Final Proficiency Score</p>
                            <h2 className={`text-6xl font-black ${score >= 50 ? 'text-green-600' : 'text-red-500'} tracking-tighter`}>{score}%</h2>
                        </div>

                        <button onClick={() => navigate("/quizzes")} className="px-12 py-5 bg-amber-600 text-white rounded-[2rem] font-bold uppercase tracking-widest text-xs hover:bg-amber-700 transition shadow-xl active:scale-95">
                            Return to Learning Hub
                        </button>
                    </div>
                </div>
            </HeritageLayout>
        );
    }

    const currentQuestion = quiz.questions[currentStep];

    return (
        <HeritageLayout>
            <div className="max-w-3xl mx-auto space-y-10 animate-fade-in text-left">
                {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

                <div className="flex items-center justify-between gap-6 bg-white dark:bg-slate-800/60 rounded-3xl p-6 border border-amber-200/30 dark:border-white/5 shadow-lg">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Assessment in Progress</p>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate uppercase tracking-tight">{quiz.title}</h1>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Question</p>
                            <p className="text-lg font-bold text-amber-600">{currentStep + 1} / {quiz.questions.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
                            <FiClock size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800/60 rounded-[2.5rem] border border-amber-200/50 dark:border-slate-700 p-10 shadow-2xl space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 grayscale">
                        <FiCheckSquare size={150} />
                    </div>

                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 bg-amber-600/10 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-amber-600/20">
                            {currentQuestion.type === 'multiple_choice' ? 'Multiple Choice Selection' : 'Subjective Fill-in'}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-10 leading-snug tracking-tight">
                            {currentQuestion.question_text}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.type === 'multiple_choice' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(currentQuestion.id, opt)}
                                            className={`p-6 text-left rounded-3xl border-2 transition-all font-medium text-sm flex items-center justify-between group ${answers[currentQuestion.id] === opt
                                                ? 'bg-amber-600 border-amber-600 text-white shadow-lg'
                                                : 'bg-stone-50 dark:bg-black/20 border-transparent text-slate-700 dark:text-gray-300 hover:border-amber-400'}`}
                                        >
                                            {opt}
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQuestion.id] === opt ? 'border-white bg-white/20' : 'border-amber-200 dark:border-white/10'}`}>
                                                {answers[currentQuestion.id] === opt && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={answers[currentQuestion.id] || ""}
                                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                    className="w-full px-8 py-6 bg-stone-50 dark:bg-black/20 rounded-3xl border-2 border-transparent focus:border-amber-500 outline-none text-xl font-bold text-amber-700 dark:text-white dark:placeholder:text-white/10 placeholder:text-slate-200 italic"
                                    placeholder="Enter your answer here..."
                                />
                            )}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-amber-100 dark:border-white/10 flex justify-between items-center group/nav">
                        <button
                            disabled={currentStep === 0}
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="flex items-center gap-3 px-8 py-4 text-slate-400 hover:text-amber-600 disabled:opacity-30 transition font-bold uppercase tracking-widest text-[10px]"
                        >
                            <FiChevronLeft size={18} /> Previous Question
                        </button>

                        {currentStep === quiz.questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                className="px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all shadow-lg active:scale-95"
                            >
                                Finalize & Submit
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="flex items-center gap-3 px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-900 transition shadow-lg"
                            >
                                Next Question <FiChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </HeritageLayout>
    );
};

export default TakeQuiz;
