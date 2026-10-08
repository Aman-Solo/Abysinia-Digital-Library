import { FiX, FiCheckCircle } from "react-icons/fi";
import { useState, useEffect } from "react";

const QuizPreview = ({ quizId, isOpen, onClose, title }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && quizId) {
            setLoading(true);
            fetch(`http://localhost:3001/quizzes/${quizId}`)
                .then(res => res.json())
                .then(data => {
                    const parsed = data.questions.map(q => ({
                        ...q,
                        options: q.options ? JSON.parse(q.options) : []
                    }));
                    setQuestions(parsed);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, quizId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-amber-200/40 dark:border-white/10" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-8 border-b border-amber-100 dark:border-white/10">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{title}</h3>
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">Quiz Content Review</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-amber-50 dark:hover:bg-white/10 rounded-2xl transition-colors">
                        <FiX size={24} className="text-slate-500 dark:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-stone-50 dark:bg-black/20 custom-scrollbar text-left">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Loading Questions...</p>
                        </div>
                    ) : questions.length > 0 ? (
                        questions.map((q, idx) => (
                            <div key={q.id} className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-amber-100 dark:border-white/5 shadow-sm">
                                <span className="inline-block px-3 py-1 bg-amber-600/10 text-amber-700 dark:text-amber-400 rounded-full text-[9px] font-bold uppercase tracking-widest mb-4 border border-amber-600/20">
                                    Question {idx + 1} • {q.type === 'multiple_choice' ? 'MCQ' : 'Fill-in'}
                                </span>
                                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6 leading-snug">{q.question_text}</h4>

                                {q.type === 'multiple_choice' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt, i) => (
                                            <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${opt === q.correct_answer ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30' : 'bg-stone-50/50 dark:bg-black/10 border-slate-100 dark:border-white/5'}`}>
                                                <span className={`text-sm font-medium ${opt === q.correct_answer ? 'text-green-700 dark:text-green-300' : 'text-slate-600 dark:text-gray-400'}`}>
                                                    <span className="font-black mr-3 opacity-30">{String.fromCharCode(65 + i)}</span>
                                                    {opt}
                                                </span>
                                                {opt === q.correct_answer && <FiCheckCircle className="text-green-600" size={18} />}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-500/30">
                                        <p className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">Correct Answer</p>
                                        <p className="text-green-700 dark:text-green-300 font-bold">{q.correct_answer}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">No questions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPreview;
