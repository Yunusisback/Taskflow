import { useState, useMemo, memo } from "react";
import { GripVertical, Trash2, ArrowRight, Check, MoreVertical } from "lucide-react"; 
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../lib/utils";

const TaskCard = ({ task, columnTheme, updateTask, deleteTask, moveTask, isOverlay }) => {

  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
// Dinamik hover rengi belirleme
  const ringColor = useMemo(() => {
    switch (columnTheme) {
      case 'blue': return 'focus-within:ring-blue-500/50 hover:border-blue-300 dark:hover:border-blue-700';
      case 'amber': return 'focus-within:ring-amber-500/50 hover:border-amber-300 dark:hover:border-amber-700';
      case 'emerald': return 'focus-within:ring-emerald-500/50 hover:border-emerald-300 dark:hover:border-emerald-700';
      default: return 'focus-within:ring-zinc-400/50 hover:border-zinc-400 dark:hover:border-zinc-600';
    }
  }, [columnTheme]);

  // Scroll bar renkleri 
  const scrollbarColor = useMemo(() => {
    switch (columnTheme) {
      case 'blue': return '[&::-webkit-scrollbar-thumb]:bg-blue-400 dark:[&::-webkit-scrollbar-thumb]:bg-blue-500';
      case 'amber': return '[&::-webkit-scrollbar-thumb]:bg-amber-400 dark:[&::-webkit-scrollbar-thumb]:bg-amber-500';
      case 'emerald': return '[&::-webkit-scrollbar-thumb]:bg-emerald-400 dark:[&::-webkit-scrollbar-thumb]:bg-emerald-500';
      default: return '[&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600';
    }
  }, [columnTheme]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-black/5 dark:bg-white/5 h-16 sm:h-20 min-h-16 sm:min-h-20 rounded-lg border-2 border-dashed border-zinc-400 dark:border-zinc-600"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={isOverlay ? undefined : style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className={cn(
        "group relative flex flex-col justify-between p-2.5 sm:p-3 min-h-16 sm:min-h-20 rounded-lg border shadow-sm transition-all duration-200 overflow-hidden",
        "bg-white border-zinc-200", 
        "dark:bg-zinc-800 dark:border-zinc-700/50",
        "hover:shadow-md active:shadow-lg",
        ringColor, 
        editMode ? "ring-2 ring-inset cursor-text" : "cursor-grab active:cursor-grabbing",
        isOverlay ? "cursor-grabbing shadow-2xl opacity-100 z-50 ring-2 ring-emerald-500/20" : ""
      )}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onTouchStart={() => setMouseIsOver(true)}
      onTouchEnd={() => setTimeout(() => setMouseIsOver(false), 2000)}
    >
      {editMode ? (
        <textarea
          className={cn(
            "h-full w-full resize-none bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 placeholder:italic focus:outline-none",
            "[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:transition-colors",
            scrollbarColor,
            "[&::-webkit-scrollbar-thumb]:hover:brightness-90"
          )}
          value={task.content}
          autoFocus
          placeholder="Not yazın..."
          onClick={(e) => e.stopPropagation()}
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      ) : (
        <>
          {/* Hover ile scrollable metin alanı */}
          <div className={cn(
            "flex-1 overflow-y-auto pr-2 -mr-2",
            "[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:transition-colors",
            scrollbarColor,
            mouseIsOver ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed break-all">
              {task.content}
            </p>
          </div>

          {/* Statik metin alanı */}
          <p className={cn(
            "absolute inset-x-2.5 top-2.5 text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed break-all pointer-events-none",
            mouseIsOver ? "opacity-0" : "opacity-100"
          )}>
            {task.content}
          </p>
          
          {/* Görev İşlem Butonları */}
          <div className={cn(
            "flex items-center justify-between mt-2 transition-opacity",
            mouseIsOver || isOverlay ? "opacity-100" : "opacity-0"
          )}>
             <div className="text-zinc-300 dark:text-zinc-600">
                <GripVertical size={14} />
             </div>
             
             <div className="flex items-center gap-1">

               {task.columnId === 'todo' && (
                 <>
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       moveTask(task.id, 'doing');
                     }}
                     className="group/btn relative p-1.5 rounded hover:bg-amber-50 dark:hover:bg-amber-900/20 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors active:scale-95"
                     title="İşleniyor'a taşı"
                   >
                     <ArrowRight size={14} />
                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                       İşleniyor
                     </span>
                   </button>
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       moveTask(task.id, 'done');
                     }}
                     className="group/btn relative p-1.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-95"
                     title="Tamamlandı'ya taşı"
                   >
                     <Check size={14} />
                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                       Tamamlandı
                     </span>
                   </button>
                 </>
               )}
               
               {/* Sil Butonu */}
               <button
                 onClick={(e) => {
                   e.stopPropagation(); 
                   deleteTask(task.id);
                 }}
                 className="group/btn relative p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 text-zinc-400 hover:text-rose-500 transition-colors active:scale-95"
                 title="Sil"
               >
                 <Trash2 size={14} />
                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                   Sil
                 </span>
               </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(TaskCard);