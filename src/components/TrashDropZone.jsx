import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import clsx from "clsx";

function cn(...inputs) {
  return clsx(inputs);
}

const TrashDropZone = ({ count, onClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "TRASH_DROP_ZONE",
    data: {
      type: "Trash"
    }
  });

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      className={`
        relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 cursor-pointer border active:scale-95
        ${isOver 
          ? "bg-rose-100 dark:bg-rose-900/30 border-rose-500 text-rose-600 dark:text-rose-400 scale-110 shadow-lg shadow-rose-500/20" 
          : "bg-zinc-100 dark:bg-zinc-800 border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-zinc-700" 
        }
      `}
      title="Çöp Kutusu (Sürükleyip Bırakabilirsiniz)"
    >
      <Trash2 size={16} strokeWidth={2} className={cn("sm:w-[18px] sm:h-[18px]", isOver ? "animate-bounce" : "")} />
      
      {/* Sayaç */}
      {count > 0 && (
        <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] sm:text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-900">
          {count}
        </span>
      )}
      
      {/* Sürükleme sırasında çıkan yazı */}
      {isOver && (
        <div className="absolute top-11 sm:top-12 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in slide-in-from-top-2">
          Silmek için bırak
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-600 rotate-45"></div>
        </div>
      )}
    </button>
  );
};

export default TrashDropZone;