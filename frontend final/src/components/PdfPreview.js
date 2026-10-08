import { FiX, FiExternalLink } from "react-icons/fi";

const PdfPreview = ({ url, isOpen, onClose, title }) => {
    if (!isOpen) return null;

    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);

    const handleOpenNewTab = () => {
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-amber-200/40 dark:border-white/10" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-amber-100 dark:border-white/10">
                    <div className="flex items-center gap-4 min-w-0 pr-10">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate uppercase tracking-tight">{title}</h3>
                        <button
                            onClick={handleOpenNewTab}
                            className="p-2 hover:bg-amber-50 dark:hover:bg-white/10 rounded-xl transition-colors text-amber-600 dark:text-amber-400 group flex items-center gap-2 flex-shrink-0"
                            title="Open in new tab"
                        >
                            <FiExternalLink size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:inline">Open in New Tab</span>
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-amber-50 dark:hover:bg-white/10 rounded-xl transition-colors">
                        <FiX size={24} className="text-slate-500 dark:text-white" />
                    </button>
                </div>
                <div className="flex-1 bg-stone-100 dark:bg-black/20 flex items-center justify-center overflow-hidden">
                    {isImage ? (
                        <img
                            src={url}
                            alt={title}
                            className="max-w-full max-h-full object-contain shadow-inner"
                        />
                    ) : (
                        <iframe
                            src={`${url}#toolbar=0`}
                            className="w-full h-full border-none"
                            title={title}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PdfPreview;
