import { FiAlertTriangle } from "react-icons/fi";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-indigo-200/40 dark:border-white/10 animate-scale-up">
                <div className="p-8 text-center">
                    <div className={`w-20 h-20 ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <FiAlertTriangle size={40} />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">{message}</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest text-white ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'} shadow-lg shadow-red-500/20 transition-all`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
