import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

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
        p-3 rounded-xl border transition-all duration-300 shadow-sm cursor-pointer group flex items-center gap-2 relative
        ${isOver 
            ? "bg-rose-50 dark:bg-rose-900/20 border-rose-400 dark:border-rose-700 text-rose-500 dark:text-rose-400 scale-110 shadow-rose-200 dark:shadow-rose-900/30" 
            : "bg-white dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-500 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/10" 
        }
      `}
      title="Çöp Kutusu (Sürükleyip Bırakabilirsiniz)"
    >
      <Trash2 size={20} className={isOver ? "animate-bounce" : ""} />
      
      {/* Sayaç */}
      {count > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md shadow-rose-200 dark:shadow-rose-900/50">
            {count}
        </span>
      )}
      
      {/* Sürükleme sırasında çıkan yazı */}
      {isOver && (
        <span className="absolute top-14 right-0 bg-rose-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
            Silmek için bırak
        </span>
      )}
    </button>
  );
};

export default TrashDropZone;