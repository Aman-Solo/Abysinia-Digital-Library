import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiClock, FiUser, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import HeritageLayout from "../components/HeritageLayout";

const BrowseQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [qRes, sRes] = await Promise.all([
                    fetch("http://localhost:3001/quizzes/approved"),
                    fetch(`http://localhost:3001/quizzes/student/${user.id}`)
                ]);

                if (qRes.ok) setQuizzes(await qRes.json());
                if (sRes.ok) setSubmissions(await sRes.json());
            } catch (err) {
                console.error("Failed to fetch quizzes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const isTaken = (quizId) => submissions.some(s => s.quiz_id === quizId);
    const getScore = (quizId) => submissions.find(s => s.quiz_id === quizId)?.score;

    return (
        <HeritageLayout>
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-in text-left">
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 text-white">
                        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Quizzes & Exams</h1>
                        <p className="opacity-80 font-medium uppercase tracking-widest text-xs">Test your knowledge and track your progress</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <FiBookOpen className="text-amber-600" /> Available Assessments ({quizzes.length})
                        </h2>
                        <div className="h-0.5 flex-1 bg-amber-200 dark:bg-amber-900/20 mx-6"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {quizzes.map(quiz => (
                                <div key={quiz.id} className="bg-white dark:bg-slate-800/60 rounded-[2rem] border border-amber-200/50 dark:border-slate-700 p-8 flex flex-col h-full hover:shadow-2xl transition-all group relative overflow-hidden">
                                    {isTaken(quiz.id) && (
                                        <div className="absolute top-0 right-0 p-6">
                                            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-green-200 dark:border-green-800">
                                                <FiCheckCircle /> Taken: {getScore(quiz.id)}%
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-amber-700 dark:text-white mb-2 uppercase tracking-tight">{quiz.title}</h3>
                                        <p className="text-xs text-slate-600 dark:text-gray-400 font-medium italic mb-6">"{quiz.description}"</p>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                                                <FiUser className="text-amber-600" /> Instructor: {quiz.teacher_name}
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                                                <FiClock className="text-amber-600" /> Posted: {new Date(quiz.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to={isTaken(quiz.id) ? "#" : `/take-quiz/${quiz.id}`}
                                        className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${isTaken(quiz.id) ? "bg-stone-100 dark:bg-white/5 text-slate-400 cursor-not-allowed" : "bg-amber-600 text-white hover:bg-amber-700 shadow-xl"}`}
                                    >
                                        {isTaken(quiz.id) ? "Assessment Completed" : "Start Assessment"} <FiChevronRight />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </HeritageLayout>
    );
};

export default BrowseQuizzes;
