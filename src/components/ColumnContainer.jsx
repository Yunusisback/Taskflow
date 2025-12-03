import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Trash2, Plus, GripVertical, Pencil } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sütun Konteyneri Bileşeni
const ColumnContainer = ({ 
  column, 
  deleteColumn,
  updateColumn,
  createTask, 
  tasks, 
  deleteTask, 
  updateTask 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(column.title);

// Görevlerin ID lerini hafızada tutarak performansı artırıyoruz
  const tasksIds = useMemo(() => tasks.map(t => t.id), [tasks]);

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
        className="w-96 shrink-0 rounded-3xl border-2 border-dashed border-amber-500/40 bg-neutral-900/10 h-full opacity-70"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/column flex h-full w-96 shrink-0 flex-col rounded-3xl bg-neutral-900/60 backdrop-blur-md border border-neutral-800/50 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-900/30 transition-all"
    >
      {/* header */}
      <div className="flex h-16 items-center justify-between px-4 gap-3 group/header shrink-0">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300"
          >
            <GripVertical size={22} />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center min-w-[28px] px-2.5 py-1 text-xs font-bold rounded-full bg-neutral-800/80 text-neutral-300">
              {tasks.length}
            </div>

            {editMode ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                className="w-48 px-2 py-1 text-lg font-semibold bg-neutral-800/80 rounded-lg border border-amber-500/50 focus:outline-none focus:border-amber-400 text-white"
              />
            ) : (
              <h2 className="text-lg font-semibold text-neutral-100 select-none">
                {column.title}
              </h2>
            )}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <button
            onClick={() => setEditMode(true)}
            className="p-2 rounded-xl text-neutral-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => deleteColumn(column.id)}
            className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    

       {/* Ayırıcı Çizgi  */}
      <div className="h-px bg-neutral-800/50 mx-4 shrink-0" />

      {/* Görev Listesi */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden px-3 pt-3 pb-2 min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-700/60">
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500">
            <div className="text-sm italic">Henüz görev yok</div>
            <div className="text-xs mt-1 opacity-70">Buraya görev sürükleyin</div>
          </div>
        )}
      </div>

      {/*  yeni görev ekle */}
      <div className="px-3 pb-4 shrink-0">
        <button
          onClick={() => createTask(column.id)}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-neutral-400 hover:text-neutral-100 hover:bg-amber-500/10 transition-all font-medium text-sm group/add"
        >
          <Plus size={18} className="group-hover/add:scale-110 transition-transform" />
          <span>Yeni görev ekle</span>
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;