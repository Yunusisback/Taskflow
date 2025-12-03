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
        p-3 rounded-xl border transition-all duration-300 shadow-lg cursor-pointer group flex items-center gap-2 relative
        ${isOver 
            ? "bg-rose-500/20 border-rose-500 text-rose-400 scale-110 shadow-rose-500/30" // Üzerine gelince
            : "bg-neutral-900/50 backdrop-blur-md border-neutral-700/50 text-neutral-400 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10" 
        }
      `}
      title="Çöp Kutusu (Sürükleyip Bırakabilirsiniz)"
    >
      <Trash2 size={20} className={isOver ? "animate-bounce" : ""} />
      
      {/* Sayaç */}
      {count > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg shadow-rose-500/40">
            {count}
        </span>
      )}
      
      {/* Sürükleme sırasında çıkan yazı */}
      {isOver && (
        <span className="absolute top-14 right-0 bg-rose-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Silmek için bırak
        </span>
      )}
    </button>
  );
};

export default TrashDropZone;