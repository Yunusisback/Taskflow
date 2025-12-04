import { useMemo, useRef, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { Plus, Download, Moon, Sun, Leaf } from "lucide-react"; 
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import TrashDropZone from "./TrashDropZone";
import Trash from "./Trash";
import ConfirmModal from "./ConfirmModal";
import { useKanbanData } from "../hooks/useKanbanData";

// Ana Kanban Tahtası Bileşeni
const KanbanBoard = ({ darkMode, toggleTheme }) => {
  const scrollRef = useRef(null);

  const {
    columns,
    setColumns,
    tasks,
    setTasks,
    trash,
    createNewColumn,
    createTask,
    updateColumn,
    deleteColumn,
    deleteTask,
    updateTask,
    restoreItem,
    deletePermanently,
  } = useKanbanData();

  // Durum yönetimi
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeCol, setActiveCol] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const columnsId = useMemo(() => columns.map(c => c.id), [columns]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  // Yedekleme fonksiyonu
  const download = () => {
    const data = { columns, tasks, trash, date: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kanban-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
// Drag işlemi başladığında
  const onDragStart = (e) => {
    if (e.active.data.current?.type === "Column") setActiveCol(e.active.data.current.column);
    if (e.active.data.current?.type === "Task") setActiveTask(e.active.data.current.task);
  };

// Drag işlemi sırasında
  const onDragOver = (e) => {
    const { active, over } = e;
    if (!over || over.id === "TRASH_DROP_ZONE") return;
    if (active.data.current?.type !== "Task") return;

// Görev sürükleme işlemi
    setTasks(tasks => {
      const activeIdx = tasks.findIndex(t => t.id === active.id);
      const overIdx = tasks.findIndex(t => t.id === over.id);
      const targetColId = over.data.current?.type === "Column" ? over.id : tasks[overIdx]?.columnId || over.id;

      if (tasks[activeIdx].columnId !== targetColId) {
        tasks[activeIdx].columnId = targetColId;
      }
      return arrayMove(tasks, activeIdx, overIdx >= 0 ? overIdx : activeIdx);
    });
  };
// Drag işlemi bittiğinde
  const onDragEnd = (e) => {
    setActiveCol(null);
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

// Eğer öğe çöp kutusuna bırakıldıysa
    if (over.id === "TRASH_DROP_ZONE") {
      setItemToDelete(active.data.current);
      setIsConfirmOpen(true);
      return;
    }
// Sütun sürükleme işlemi
    if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
      setColumns(cols => {
        const old = cols.findIndex(c => c.id === active.id);
        const nev = cols.findIndex(c => c.id === over.id);
        return arrayMove(cols, old, nev);
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={onDragStart} 
      onDragOver={onDragOver} 
      onDragEnd={onDragEnd}
    >
      <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 text-stone-800 dark:text-neutral-100 selection:bg-emerald-200 dark:selection:bg-emerald-900 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-300">
        
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-stone-100 via-white to-stone-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 opacity-80 transition-colors duration-300" />
        
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-stone-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl shadow-sm transition-colors duration-300">
          <div className="flex h-full items-center justify-between px-8">
            
            {/* LOGO VE BAŞLIK */}
            <div className="flex items-center gap-3">
              {/* İkon*/}
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                 <Leaf size={20} className="fill-current" />
              </div>
              
              {/* Başlık */}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-700 to-stone-500 dark:from-stone-200 dark:to-stone-400 bg-clip-text text-transparent">
                Taskflow
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 hover:bg-stone-200 dark:hover:bg-neutral-700 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
                title={darkMode ? "Aydınlık Mod" : "Karanlık Mod"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <TrashDropZone count={trash.length} onClick={() => setIsTrashOpen(true)} />
              
              <button onClick={download} className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 border border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all font-medium shadow-sm">
                <Download size={18} /> Yedekle
              </button>
            </div>
          </div>
        </header>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => { setIsConfirmOpen(false); setItemToDelete(null); }}
          onConfirm={() => {
            if (itemToDelete?.type === "Column") deleteColumn(itemToDelete.column.id);
            if (itemToDelete?.type === "Task") deleteTask(itemToDelete.task.id);
            setItemToDelete(null); setIsConfirmOpen(false);
          }}
          title="Silinsin mi?"
          message={itemToDelete?.type === "Column" ? `"${itemToDelete.column.title}" ve içindekiler çöpe gitsin mi?` : "Bu görev çöpe gitsin mi?"}
        />
        
        <Trash isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} trashItems={trash} restoreItem={restoreItem} deletePermanently={deletePermanently} />
        <div ref={scrollRef} className="flex h-screen gap-8 overflow-x-auto px-12 pt-24 pb-8 scroll-smooth [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-track]:bg-transparent">
          <SortableContext items={columnsId}>
            {columns.map(col => (
              <ColumnContainer
                key={col.id}
                column={col}
                tasks={tasks.filter(t => t.columnId === col.id)}
                createTask={createTask}
                updateColumn={updateColumn}
                deleteColumn={deleteColumn}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ))}
          </SortableContext>

          <button
            onClick={createNewColumn}
            className="flex h-[calc(100vh-120px)] w-96 shrink-0 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-300 dark:border-neutral-700 bg-stone-100/50 dark:bg-neutral-900/30 hover:bg-white dark:hover:bg-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 text-stone-400 dark:text-neutral-600 transition-all group"
          >
            <div className="rounded-full bg-white dark:bg-neutral-800 p-6 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all text-stone-400 dark:text-neutral-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400">
              <Plus size={40} />
            </div>
            <span className="mt-6 text-2xl font-semibold">Yeni Liste</span>
          </button>
        </div>
         
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeCol && <ColumnContainer column={activeCol} tasks={tasks.filter(t => t.columnId === activeCol.id)} createTask={()=>{}} updateColumn={()=>{}} deleteColumn={()=>{}} deleteTask={()=>{}} updateTask={()=>{}} />}
            {activeTask && <TaskCard task={activeTask} deleteTask={()=>{}} updateTask={()=>{}} />}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;