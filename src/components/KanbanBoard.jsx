import { useMemo, useRef, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { Plus, Download } from "lucide-react";
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
const KanbanBoard = () => {
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
// Modal ve sürükleme durumu
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

  const onDragStart = (e) => {
    if (e.active.data.current?.type === "Column") setActiveCol(e.active.data.current.column);
    if (e.active.data.current?.type === "Task") setActiveTask(e.active.data.current.task);
  };
 // Sürükleme sırasında görevlerin başka sütunlara taşınması
  const onDragOver = (e) => {
    const { active, over } = e;
    if (!over || over.id === "TRASH_DROP_ZONE") return;
    if (active.data.current?.type !== "Task") return;

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
 // Sürükleme işlemi bittiğinde
  const onDragEnd = (e) => {
    setActiveCol(null);
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

    if (over.id === "TRASH_DROP_ZONE") {
      setItemToDelete(active.data.current);
      setIsConfirmOpen(true);
      return;
    }

    if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
      setColumns(cols => {
        const old = cols.findIndex(c => c.id === active.id);
        const nev = cols.findIndex(c => c.id === over.id);
        return arrayMove(cols, old, nev);
      });
    }
  };

  return (
    <>
    
      <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500/30">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-900/10 via-neutral-950 to-orange-900/5" />
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]" />

        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-xl">
          <div className="flex h-full items-center justify-between px-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Taskflow
            </h1>
            <div className="flex items-center gap-4">
              <TrashDropZone count={trash.length} onClick={() => setIsTrashOpen(true)} />
              <button onClick={download} className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-800/50 hover:bg-amber-500/20 border border-neutral-700 hover:border-amber-500/50 text-neutral-300 hover:text-amber-400 transition-all font-medium">
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

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div ref={scrollRef} className="flex h-screen gap-8 overflow-x-auto px-12 pt-24 pb-8 scroll-smooth [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-700/50">
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
              className="flex h-[calc(100vh-120px)] w-96 shrink-0 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-700/50 bg-neutral-900/20 backdrop-blur-md text-neutral-400 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300 transition-all group"
            >
              <div className="rounded-full bg-neutral-800/50 p-6 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all">
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
        </DndContext>
      </div>
    </>
  );
};

export default KanbanBoard;