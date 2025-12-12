import { X, RotateCcw, Trash2, Layout, FileText } from "lucide-react";
import { cn } from "../lib/utils"; 

const Trash = ({ isOpen, onClose, trashItems, restoreItem, deletePermanently }) => {


  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex justify-end transition-all duration-500",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible delay-500" 
      )}
    >
      {/* Arka plan */}
      <div 
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-stone-900/20 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      ></div>

      {/* Kayar Panel */}
      <div 
      
        className={cn(
          "relative w-full sm:max-w-md h-full bg-white dark:bg-neutral-900 shadow-2xl border-l border-stone-200 dark:border-neutral-800 flex flex-col transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)", 
          isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none"
        )}
      >
        
        {/* Başlık Kısmı */}
        <div className="p-4 sm:p-6 border-b border-stone-100 dark:border-neutral-800 flex items-center justify-between bg-stone-50/50 dark:bg-neutral-900">
          <div className="flex items-center gap-2 text-rose-500">
            <Trash2 size={22} className="sm:w-6 sm:h-6" />
            <h2 className="text-lg sm:text-xl font-bold text-stone-800 dark:text-neutral-100 select-none">Çöp Kutusu</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-200 dark:hover:bg-neutral-800 rounded-lg text-stone-400 dark:text-neutral-500 hover:text-stone-700 dark:hover:text-neutral-200 transition-colors cursor-pointer active:scale-95"
          >
            <X size={22} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Liste Kısmı */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3 custom-scrollbar ">
          {trashItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 dark:text-neutral-600 gap-4">
              <Trash2 size={40} className="sm:w-12 sm:h-12 opacity-20" />
              <p className="text-sm sm:text-base">Çöp kutusu boş</p>
            </div>
          ) : (
            trashItems.map((item) => (
              <div 
                key={item.deletedAt} 

                className="group p-3 sm:p-4 bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl hover:border-rose-300 dark:hover:border-rose-800 hover:shadow-md transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    
                    {/* Sütun veya görev ikonunu belirleyen alan */}
                    <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${item.type === 'column' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400'}`}>
                      {item.type === 'column' ? <Layout size={16} className="sm:w-[18px] sm:h-[18px]" /> : <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-stone-700 dark:text-neutral-200 line-clamp-2 break-words">
                        {item.type === 'column' ? item.title : item.content}
                      </p>
                      <span className="text-[10px] sm:text-xs text-stone-500 dark:text-neutral-500">
                          {item.type === 'column' ? 'Sütun' : 'Görev'} • {new Date(item.deletedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Geri yükle ve kalıcı sil butonları */}
                  <div className="flex gap-1.5 sm:gap-2 shrink-0">
                    <button 
                      onClick={() => restoreItem(item)}
                      title="Geri Yükle"
                      className="p-1.5 sm:p-2 rounded-lg bg-stone-100 dark:bg-neutral-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-stone-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer active:scale-95"
                    >
                      <RotateCcw size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button 
                      onClick={() => deletePermanently(item.deletedAt)}
                      title="Kalıcı Olarak Sil"
                      className="p-1.5 sm:p-2 rounded-lg bg-stone-100 dark:bg-neutral-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-stone-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer active:scale-95"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>   
      </div>
    </div>
  );
};

export default Trash;