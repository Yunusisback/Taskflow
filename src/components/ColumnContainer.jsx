import { useMemo, useState, memo } from "react";
import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Trash2, Plus, GripVertical, Pencil, Palette } from "lucide-react";
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
  isOverlay,
  disableColorChange
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Görevlerin ID lerini hafızada tutarak performansı artırıyoruz
  const tasksIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  // kullanıcı renk paleti
  const colorPalette = [
    { id: 'blue', name: 'Mavi', bg: 'bg-blue-500', darkBg: 'dark:bg-blue-600' },
    { id: 'amber', name: 'Turuncu', bg: 'bg-amber-500', darkBg: 'dark:bg-amber-600' },
    { id: 'emerald', name: 'Yeşil', bg: 'bg-emerald-500', darkBg: 'dark:bg-emerald-600' },
    { id: 'rose', name: 'Kırmızı', bg: 'bg-rose-500', darkBg: 'dark:bg-rose-600' },
    { id: 'purple', name: 'Mor', bg: 'bg-purple-500', darkBg: 'dark:bg-purple-600' },
    { id: 'pink', name: 'Pembe', bg: 'bg-pink-500', darkBg: 'dark:bg-pink-600' },
    { id: 'cyan', name: 'Cyan', bg: 'bg-cyan-500', darkBg: 'dark:bg-cyan-600' },
    { id: 'indigo', name: 'İndigo', bg: 'bg-indigo-500', darkBg: 'dark:bg-indigo-600' },
    { id: 'zinc', name: 'Gri', bg: 'bg-zinc-500', darkBg: 'dark:bg-zinc-600' },
  ];

  // Sütun rengi 
  const columnColor = useMemo(() => {
    if (column.id === 'todo') return 'blue';
    if (column.id === 'doing') return 'amber';
    if (column.id === 'done') return 'emerald';
    return column.color || 'zinc';
  }, [column.id, column.color]);

  // Renk teması dinamik
  const variants = {
    zinc: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-zinc-500 dark:bg-zinc-600",
      border: "border-zinc-200 dark:border-zinc-700",
      hoverBorder: "hover:border-zinc-300 dark:hover:border-zinc-600",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-zinc-400/30 dark:text-zinc-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
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
    },
    rose: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-rose-500 dark:bg-rose-600",
      border: "border-rose-300 dark:border-rose-600/50",
      hoverBorder: "hover:border-rose-500 dark:hover:border-rose-400",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-rose-400/30 dark:text-rose-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
    },
    purple: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-purple-500 dark:bg-purple-600",
      border: "border-purple-300 dark:border-purple-600/50",
      hoverBorder: "hover:border-purple-500 dark:hover:border-purple-400",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-purple-400/30 dark:text-purple-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
    },
    pink: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-pink-500 dark:bg-pink-600",
      border: "border-pink-300 dark:border-pink-600/50",
      hoverBorder: "hover:border-pink-500 dark:hover:border-pink-400",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-pink-400/30 dark:text-pink-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
    },
    cyan: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-cyan-500 dark:bg-cyan-600",
      border: "border-cyan-300 dark:border-cyan-600/50",
      hoverBorder: "hover:border-cyan-500 dark:hover:border-cyan-400",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-cyan-400/30 dark:text-cyan-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
    },
    indigo: {
      bg: "bg-zinc-50 dark:bg-zinc-900/70",
      headerBg: "bg-indigo-500 dark:bg-indigo-600",
      border: "border-indigo-300 dark:border-indigo-600/50",
      hoverBorder: "hover:border-indigo-500 dark:hover:border-indigo-400",
      text: "text-white dark:text-white",
      accent: "bg-white/20 text-white dark:bg-indigo-400/30 dark:text-indigo-100",
      buttonHover: "hover:bg-white/20 dark:hover:bg-white/10",
    }
  };

  const theme = variants[columnColor];

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

    // Başlık güncellenirken rengi de mevcut renkle (columnColor) gönderiyoruz
    if (title.trim() && title !== column.title) {
      updateColumn(column.id, title.trim(), columnColor);
    }
    setEditMode(false);
  };

  // Renk değiştirme
  const changeColor = (colorId) => {
    updateColumn(column.id, column.title, colorId);
    setShowColorPicker(false);
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
      {/* HEADER */}
      <div className={cn(
        "relative flex flex-col gap-2 px-4 sm:px-5 py-3 sm:py-4 group/header shrink-0 rounded-t-2xl sm:rounded-t-3xl overflow-visible",
        theme.headerBg,
        "shadow-sm"
      )}>
        {/* Arka plan efekt */}
        <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent pointer-events-none" />

        {/* Üst Satır: drag handle + başlık + butonlar */}
        <div className="relative flex items-center gap-3">

          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover/header:opacity-70 hover:opacity-100! transition-opacity shrink-0"
          >
            <GripVertical size={20} className={cn("sm:w-5 sm:h-5 drop-shadow-sm", theme.text)} />
          </div>

          {/* Başlık Input/Text */}
          {editMode ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className="flex-1 min-w-0 px-3 py-2 text-base sm:text-lg font-bold bg-white/20 dark:bg-black/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 placeholder:text-white/70 text-white"
              placeholder="Liste adı..."
            />
          ) : (
            <h2 className={cn(
              "flex-1 min-w-0 text-base sm:text-lg font-bold select-none drop-shadow-sm break-words",
              theme.text
            )}>
              {column.title}
            </h2>
          )}

          {/* Sağ Butonlar */}
          <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover/header:opacity-100 transition-opacity">

            {/* Renk Seçici */}
            {!disableColorChange && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(prev => !prev)}
                  className={cn(
                    "p-2 rounded-lg transition-all hover:scale-110 active:scale-95 shadow-sm",
                    theme.buttonHover,
                    showColorPicker && "bg-white/20 ring-1 ring-white/30"
                  )}
                  title="Renk Değiştir"
                >
                  <Palette size={16} className={cn("sm:w-[18px] sm:h-[18px] drop-shadow-sm", theme.text)} />
                </button>

                {/* Renk Paleti Popup */}
                {showColorPicker && (
                  <div className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 animate-in fade-in zoom-in-95 duration-200 min-w-[150px]">

                    {/* Ok işareti  */}
                    <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white dark:bg-zinc-800 border-t border-l border-zinc-200 dark:border-zinc-700 rotate-45"></div>

                    {/* 3x3 Renk ızgarası */}
                    <div className="grid grid-cols-3 gap-2 relative z-10">
                      {colorPalette.map((color) => {
                        const isSelected = columnColor === color.id;
                        return (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => changeColor(color.id)}
                            className={cn(
                              "w-8 h-8 rounded-lg transition-all hover:scale-105 active:scale-95 relative shadow-sm",
                              color.bg,
                              isSelected && "ring-2 ring-zinc-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-zinc-800 scale-105 z-10"
                            )}
                            title={color.name}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edit Butonu */}
            <button
              onClick={() => setEditMode(true)}
              className={cn(
                "p-2 rounded-lg transition-all hover:scale-110 active:scale-95 shadow-sm",
                theme.buttonHover
              )}
              title="Düzenle"
            >
              <Pencil size={16} className={cn("sm:w-[18px] sm:h-[18px] drop-shadow-sm", theme.text)} />
            </button>

            {/* Sil Butonu  */}
            {column.id !== "todo" && column.id !== "doing" && column.id !== "done" && (
              <button
                onClick={() => deleteColumn(column.id)}
                className="p-2 rounded-lg bg-white/20 hover:bg-rose-500/80 hover:text-white text-rose-200 shadow-sm hover:scale-110 active:scale-95 transition-all"
                title="Sil"
              >
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px] drop-shadow-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Alt Satır*/}
        <div className="relative flex items-center gap-2">
          <div className={cn(
            "flex items-center justify-center px-3 py-1 text-sm font-bold rounded-full shadow-sm backdrop-blur-sm ring-1 ring-white/20",
            theme.accent
          )}>
            {tasks.length} görev
          </div>
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
              columnTheme={columnColor}
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

        {/* Boşluk Düzeltme */}
        {disableColorChange && <div className="h-0 sm:h-px"></div>}
      </div>
    </div>
  );
};

export default memo(ColumnContainer);