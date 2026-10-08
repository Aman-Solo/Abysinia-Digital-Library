import { useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const Notification = ({ message, type = "info", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <FiCheckCircle className="text-green-400" size={24} />,
        error: <FiAlertCircle className="text-red-400" size={24} />,
        info: <FiInfo className="text-blue-400" size={24} />,
    };

    const bgColors = {
        success: "bg-slate-900/90 border-green-500/50",
        error: "bg-slate-900/90 border-red-500/50",
        info: "bg-slate-900/90 border-blue-500/50",
    };

    return (
        <div className={`fixed top-24 right-6 z-[1000] flex items-center gap-4 p-4 rounded-xl border-l-4 shadow-2xl backdrop-blur-md animate-slide-in text-left max-w-sm w-full ${bgColors[type]}`}>
            <div className="shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="text-white font-medium text-sm">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <FiX size={18} />
            </button>
        </div>
    );
};

export default Notification;
