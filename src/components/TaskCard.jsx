import { useState, useMemo } from "react";
import { GripVertical } from "lucide-react"; 
import { useSortable } from "@dnd-kit/sortable"; 
import { CSS } from "@dnd-kit/utilities"; 
import { cn } from "../lib/utils"; 

const TaskCard = ({ task, columnTheme,updateTask }) => {

  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

// Sütun temasına göre renk ayarları
  const themeColors = useMemo(() => {
    switch (columnTheme) {
      case 'blue':
        return {
         
          border: 'border-stone-200 dark:border-neutral-700',
          hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500',
          editBorder: 'border-blue-400 dark:border-blue-600',
          ring: 'ring-blue-100 dark:ring-blue-900/30'
        };
      case 'amber':
        return {
       
          border: 'border-stone-200 dark:border-neutral-700',
          hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-500',
          editBorder: 'border-amber-400 dark:border-amber-600',
          ring: 'ring-amber-100 dark:ring-amber-900/30'
        };
      case 'emerald':
        return {
      
          border: 'border-stone-200 dark:border-neutral-700',
          hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
          editBorder: 'border-emerald-400 dark:border-emerald-600',
          ring: 'ring-emerald-100 dark:ring-emerald-900/30'
        };
      case 'stone':
      default:
        return {
          border: 'border-stone-200 dark:border-neutral-700',
          hoverBorder: 'hover:border-stone-400 dark:hover:border-neutral-500',
          editBorder: 'border-stone-400 dark:border-neutral-600',
          ring: 'ring-stone-100 dark:ring-neutral-800'
        };
    }
  }, [columnTheme]);

// dnd-kit Hooku 
  const {
    setNodeRef,  
    attributes,  
    listeners,    
    transform,   
    transition,  
    isDragging,   
  } = useSortable({
    id: task.id,
    data: {
      type: "Task", 
      task,
    },
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

// Sürüklenirken arkada kalan boşluk 
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "opacity-40 bg-stone-100 dark:bg-neutral-800 p-2.5 h-[100px] min-h-[100px] rounded-lg border-2 border-dashed",
          themeColors.editBorder 
        )}
      />
    );
  }

// Düzenleme modundayken textarea göster
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "bg-white dark:bg-neutral-800 p-3 h-[100px] min-h-[100px] rounded-lg border-2 shadow-xl ring-2",
          themeColors.editBorder,
          themeColors.ring
        )}
      >
        <textarea
          className="h-full w-full resize-none border-none rounded bg-transparent text-stone-800 dark:text-neutral-100 focus:outline-none placeholder:text-stone-400 dark:placeholder:text-neutral-500 text-sm leading-relaxed font-normal [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          value={task.content}
          autoFocus
          placeholder="Görev içeriği..."
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); 
              toggleEditMode();   
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

// Normal modda görev kartını göster
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className={cn(
        "group bg-white dark:bg-neutral-800 hover:bg-white/80 dark:hover:bg-neutral-800/80 p-3 min-h-[80px] rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-grab  active:cursor-grabbing relative overflow-hidden task ",
        themeColors.border,    
        themeColors.hoverBorder  
      )}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      
      <div className="flex items-start gap-2 h-full">
        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <GripVertical size={14} className="text-stone-300 dark:text-neutral-600 hover:text-stone-500 dark:hover:text-neutral-400" />
        </div>
        
        <p className="flex-1 text-stone-700 dark:text-neutral-200 text-sm whitespace-pre-wrap break-words leading-relaxed my-auto h-[90%] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {task.content}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;