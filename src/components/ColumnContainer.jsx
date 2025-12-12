import { useMemo, useState, memo } from "react";
import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Trash2, Plus, GripVertical, Pencil } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../lib/utils";

// Sütun konteyneri bileşeni
const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  updateTask,
  deleteTask,
  moveTask, 
  isOverlay
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(column.title);

  // Görevlerin ID lerini hafızada tutarak performansı artırıyoruz
  const tasksIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  const colorTheme = useMemo(() => {
    if (column.id === 'todo') return 'blue';
    if (column.id === 'doing') return 'amber';
    if (column.id === 'done') return 'emerald';
    return 'zinc';
  }, [column.id]);

  
  const variants = {
    zinc: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-zinc-200 dark:bg-zinc-800",
      border: "border-zinc-200 dark:border-zinc-700",
      hoverBorder: "hover:border-zinc-300 dark:hover:border-zinc-600",
      text: "text-zinc-800 dark:text-zinc-200",
      accent: "bg-white text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
      buttonHover: "hover:bg-zinc-300 dark:hover:bg-zinc-700",
    },
    blue: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-blue-500 dark:bg-blue-600",
      border: "border-blue-300 dark:border-blue-600/50",
      hoverBorder: "hover:border-blue-500 dark:hover:border-blue-400",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-blue-400/30 dark:text-blue-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
    },
    amber: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-amber-500 dark:bg-amber-600",
      border: "border-amber-300 dark:border-amber-600/50",
      hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-amber-400/30 dark:text-amber-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
    },
    emerald: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-emerald-500 dark:bg-emerald-600",
      border: "border-emerald-300 dark:border-emerald-600/50",
      hoverBorder: "hover:border-emerald-500 dark:hover:border-emerald-400",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-emerald-400/30 dark:text-emerald-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
    }
  };

  const theme = variants[colorTheme];

  // Sıralama için DND Kit kullanımı
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
    disabled: isOverlay
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  // Sütun başlığını kaydetme
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
        className="w-[calc(100vw-2rem)] sm:w-75 shrink-0 rounded-2xl sm:rounded-3xl border-2 border-dashed border-zinc-400 dark:border-zinc-600 bg-zinc-100/50 dark:bg-zinc-900/40 h-[70vh] sm:h-[75vh] opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/column flex h-[70vh] sm:h-[75vh] w-[calc(100vw-2rem)] sm:w-75 shrink-0 flex-col rounded-2xl sm:rounded-3xl transition-all duration-300 shadow-lg dark:shadow-xl",
        theme.bg,
        theme.border,
        theme.hoverBorder
      )}
    >
      {/* HEADER  */}
      <div className={cn(
        "relative flex h-14 sm:h-16 items-center px-4 sm:px-5 gap-3 group/header shrink-0 rounded-t-2xl sm:rounded-t-3xl overflow-hidden",
        theme.headerBg,
        "shadow-sm"
      )}>
        {/* Arka plan efekt */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover/header:opacity-70 hover:!opacity-100 transition-opacity"
          >
            <GripVertical size={22} className={cn("sm:w-6 sm:h-6 drop-shadow-sm", theme.text)} />
          </div>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={cn(
              "flex items-center justify-center min-w-8 sm:min-w-9 w-8 sm:w-9 h-8 sm:h-9 text-sm sm:text-base font-bold rounded-full shadow-md backdrop-blur-md ring-1 ring-white/20",
              theme.accent
            )}>
              {tasks.length}
            </div>

            {editMode ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                className="flex-1 min-w-0 px-3 py-1.5 text-lg sm:text-xl font-bold bg-white/20 dark:bg-black/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 placeholder:text-white/70"
                placeholder="Liste adı..."
              />
            ) : (
              <h2 className={cn("text-lg sm:text-xl font-bold select-none truncate drop-shadow-sm", theme.text)}>
                {column.title}
              </h2>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover/header:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setEditMode(true)}
            className={cn(
              "p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-md",
              theme.buttonHover
            )}
          >
            <Pencil size={16} className={cn("sm:w-5 sm:h-5 drop-shadow-sm", theme.text)} />
          </button>

          {column.id !== "todo" && column.id !== "doing" && column.id !== "done" && (
            <button
              onClick={() => deleteColumn(column.id)}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-rose-500/80 hover:text-white text-rose-200 shadow-md hover:scale-110 active:scale-95 transition-all"
            >
              <Trash2 size={16} className="sm:w-5 sm:h-5 drop-shadow-sm" />
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-white/20 dark:bg-white/10 shrink-0" />

      {/* GÖREV LİSTESİ */}
      <div className="flex flex-1 flex-col gap-2.5 sm:gap-3 px-2.5 sm:px-3 pt-2.5 sm:pt-3 pb-2 overflow-hidden">
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnTheme={colorTheme}
              updateTask={updateTask}
              deleteTask={deleteTask} 
              moveTask={moveTask} 
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400 select-none">
            <div className="text-sm">Henüz görev yok</div>
            <div className="text-xs mt-1 opacity-70">Buraya görev sürükleyin</div>
          </div>
        )}
      </div>

      {/* Yeni Görev Ekle */}
      <div className="p-2.5 sm:p-3 shrink-0">
        <button
          onClick={() => createTask(column.id)}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 transition-all font-medium text-sm group/add cursor-pointer active:scale-95 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-lg hover:bg-white/50 dark:hover:bg-zinc-800/60",
            "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
          )}
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px] group-hover/add:scale-110 transition-transform" />
          <span>Yeni görev ekle</span>
        </button>
      </div>
    </div>
  );
};

export default memo(ColumnContainer);