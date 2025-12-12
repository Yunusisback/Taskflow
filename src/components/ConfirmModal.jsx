import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Arka Plan  */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/20 dark:bg-black/70 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal İçeriği */}
      <div className="relative w-full max-w-[340px] sm:max-w-sm bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-5 sm:p-6 transform transition-all scale-100">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-stone-400 dark:text-neutral-500 hover:text-stone-800 dark:hover:text-neutral-200 transition-colors active:scale-95"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-500">
            <AlertTriangle size={28} className="sm:w-8 sm:h-8" />
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-stone-800 dark:text-neutral-100">{title}</h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-neutral-400 px-2">{message}</p>
          </div>

          <div className="flex gap-2.5 sm:gap-3 w-full mt-1 sm:mt-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-300 hover:bg-stone-200 dark:hover:bg-neutral-700 font-medium transition-colors text-sm active:scale-95"
            >
              İptal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 font-medium transition-colors shadow-lg shadow-rose-200 dark:shadow-rose-900/20 text-sm active:scale-95"
            >
              Evet, Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;