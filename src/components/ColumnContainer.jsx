import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Trash2, Plus, GripVertical, Pencil } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../lib/utils"; 

// Sütun Konteyneri Bileşeni
const ColumnContainer = ({ 
  column, 
  deleteColumn,
  updateColumn,
  createTask, 
  tasks, 
  updateTask 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(column.title);

// Görevlerin ID lerini hafızada tutarak performansı artırıyoruz
  const tasksIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  // Sütun kimliğine (id) göre renk teması belirleme
  const colorTheme = useMemo(() => {
      if (column.id === 'todo') return 'blue';    
      if (column.id === 'doing') return 'amber';   
      if (column.id === 'done') return 'emerald'; 
      return 'stone'; 
  }, [column.id]);

  const variants = {
    stone: {
   
      bg: "bg-stone-50 dark:bg-neutral-900/40",
      
      headerBg: "bg-stone-200/80 dark:bg-neutral-800",
      border: "border-stone-200 dark:border-neutral-800",
      hoverBorder: "hover:border-stone-400 dark:hover:border-neutral-600",
      text: "text-stone-700 dark:text-neutral-300",
      accent: "bg-white text-stone-600 dark:bg-neutral-700 dark:text-neutral-300",
      buttonHover: "hover:bg-stone-200 dark:hover:bg-neutral-800",
      shadow: "hover:shadow-stone-200/50 dark:hover:shadow-neutral-900/50"
    },
    blue: {
      bg: "bg-stone-50 dark:bg-neutral-900/40",
    
      headerBg: "bg-blue-300 dark:bg-blue-800/60",
      border: "border-blue-200 dark:border-blue-900/30",
      hoverBorder: "hover:border-blue-400 dark:hover:border-blue-700",
      text: "text-blue-900 dark:text-blue-100",
      accent: "bg-white text-blue-700 dark:bg-blue-800 dark:text-blue-200",
      buttonHover: "hover:bg-blue-200 dark:hover:bg-blue-900/40",
      shadow: "hover:shadow-blue-600/30 dark:hover:shadow-blue-600/80"
    },
    amber: {
      bg: "bg-stone-50 dark:bg-neutral-900/40",
    
      headerBg: "bg-amber-200 dark:bg-amber-900/50",
      border: "border-amber-200 dark:border-amber-900/30",
      hoverBorder: "hover:border-amber-400 dark:hover:border-amber-700",
      text: "text-amber-900 dark:text-amber-400",
      accent: "bg-white text-amber-700 dark:bg-amber-800 dark:text-amber-200",
      buttonHover: "hover:bg-amber-200 dark:hover:bg-amber-900/40",
      shadow: "hover:shadow-amber-500/30 dark:hover:shadow-amber-600/50"
    },
    emerald: {
      bg: "bg-stone-50 dark:bg-neutral-900/40",
      
      headerBg: "bg-emerald-300 dark:bg-emerald-900/60",
      border: "border-emerald-200 dark:border-emerald-900/30",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-700",
      text: "text-emerald-900 dark:text-emerald-400",
      accent: "bg-white text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200",
      buttonHover: "hover:bg-emerald-200 dark:hover:bg-emerald-900/40",
      shadow: "hover:shadow-emerald-400/30 dark:hover:shadow-emerald-500/60"
    }
  };

  const theme = variants[colorTheme];

  // dnd-kit Hooku sütun için
  const { 
    setNodeRef, 
    attributes, 
    listeners, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  const saveTitle = () => {
    if (title.trim() && title !== column.title) {
      updateColumn(column.id, title.trim());
    }
    setEditMode(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-96 shrink-0 rounded-3xl border-2 border-dashed border-stone-300 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-900 h-full opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/column flex h-full w-96 shrink-0 flex-col rounded-3xl backdrop-blur-md border transition-all hover:shadow-2xl",
        theme.bg, 
        theme.border,
        theme.hoverBorder,
        theme.shadow
      )}
    >
      {/* header */}
      <div className={cn("flex h-16 items-center justify-between px-4 gap-3 group/header shrink-0 rounded-t-[22px]", theme.headerBg)}>
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-stone-500 dark:text-neutral-400 hover:text-stone-700 dark:hover:text-neutral-200"
          >
            <GripVertical size={22} />
          </div>

          <div className="flex items-center gap-2.5">

            {/* Görev sayısı rozeti */}
            <div className={cn("flex items-center border-3  justify-center min-w-[48px] px-2.5 py-1 text-sm font-bold rounded-full shadow-sm", theme.accent)}>
              {tasks.length}
            </div>

            {editMode ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                className="w-48 px-2 py-1 text-lg font-semibold bg-white dark:bg-neutral-800 rounded-lg border border-stone-300 dark:border-neutral-600 focus:outline-none focus:border-emerald-500 text-stone-800 dark:text-neutral-100 shadow-sm"
              />
            ) : (
              <h2 className={cn("text-lg font-bold select-none", theme.text)}>
                {column.title}
              </h2>
            )}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
          {/* Düzenle Butonu */}
          <button
            onClick={() => setEditMode(true)}
            className={cn("p-2 rounded-xl text-stone-600 dark:text-neutral-300 transition-all cursor-pointer hover:scale-110 active:scale-95", theme.buttonHover)}
          >
            <Pencil size={16} />
          </button>
          
          {/* Silme Butonu  */}
          {column.id !== "todo" && column.id !== "doing" && column.id !== "done" && (
            <button
              onClick={() => deleteColumn(column.id)}
              className="p-2 rounded-xl text-stone-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all cursor-pointer hover:scale-110 active:scale-95"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    

       {/* Ayırıcı Çizgi */}
      <div className="h-px bg-stone-200/50 dark:bg-neutral-700/50 shrink-0" />

      {/* Görev Listesi */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-2 min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-stone-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700/50">
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnTheme={colorTheme} 
  
              updateTask={updateTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 dark:text-neutral-600">
            <div className="text-sm italic">Henüz görev yok</div>
            <div className="text-xs mt-1 opacity-70">Buraya görev sürükleyin</div>
          </div>
        )}
      </div>

      {/* yeni görev ekle */}
      <div className="px-3 pb-4 shrink-0">
        <button
          onClick={() => createTask(column.id)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-3 py-3 transition-all font-medium text-sm group/add cursor-pointer active:scale-95",
            "text-stone-500 dark:text-neutral-500 hover:text-stone-800 dark:hover:text-neutral-300",
            theme.buttonHover
          )}
        >
          <Plus size={18} className="group-hover/add:scale-110 transition-transform" />
          <span>Yeni görev ekle</span>
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;