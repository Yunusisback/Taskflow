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
        className="opacity-30 bg-black/5 dark:bg-white/5 h-20 min-h-20 rounded-lg border-2 border-dashed border-zinc-400 dark:border-zinc-600"
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
        "group relative flex flex-col justify-between p-3 min-h-20 rounded-lg border shadow-sm transition-all duration-200",
     
        "bg-white border-zinc-200", 

        "dark:bg-zinc-800 dark:border-zinc-700/50",
        
        "hover:shadow-md",
        ringColor, 
        
        editMode ? "ring-2 ring-inset cursor-text" : "cursor-grab active:cursor-grabbing",
        
     
        isOverlay ? "cursor-grabbing shadow-2xl opacity-100 z-50 ring-2 ring-emerald-500/20" : ""
      )}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      {editMode ? (
        <textarea
          className="h-full w-full resize-none bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Ne yapılması gerekiyor?"
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
          <p className="text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed wrap-break-word">
            {task.content}
          </p>
          
           {/*  Görev İşlem Butonları  */}
          <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                     className="group/btn relative p-1.5 rounded hover:bg-amber-50 dark:hover:bg-amber-900/20 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                     title="İşleniyor'a taşı"
                   >
                     <ArrowRight size={14} />
                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                       İşleniyor
                     </span>
                   </button>
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       moveTask(task.id, 'done');
                     }}
                     className="group/btn relative p-1.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                     title="Tamamlandı'ya taşı"
                   >
                     <Check size={14} />
                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                       Tamamlandı
                     </span>
                   </button>
                 </>
               )}
               
               {/* Sil Butonu  */}
               <button
                 onClick={(e) => {
                   e.stopPropagation(); 
                   deleteTask(task.id);
                 }}
                 className="group/btn relative p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 text-zinc-400 hover:text-rose-500 transition-colors"
                 title="Sil"
               >
                 <Trash2 size={14} />
                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 dark:bg-zinc-700 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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