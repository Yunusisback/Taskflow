import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import ColumnContainer from "./ColumnContainer";
import { Plus, Download, Moon, Sun, Leaf } from "lucide-react"; 
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  MeasuringStrategy  
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import TrashDropZone from "./TrashDropZone";
import Trash from "./Trash";
import ConfirmModal from "./ConfirmModal";
import FloatingNav from "./FloatingNav";
import { useKanbanData } from "../hooks/useKanbanData";

 
const KanbanBoard = ({ darkMode, toggleTheme }) => {
  const scrollRef = useRef(null);
  const itemsRef = useRef([]);
  const isManualScroll = useRef(false);
  const scrollTimeout = useRef(null);
  
  
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
    moveTask, 
    restoreItem,
    deletePermanently,
  } = useKanbanData();

   // Çöp kutusu ve onay modal durumları
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeCol, setActiveCol] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);

  const columnsId = useMemo(() => columns.map(c => c.id), [columns]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

 // Sütun Görünürlüğü İzleme ve Aktif Sütun Belirleme
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemsRef.current.indexOf(entry.target);
            if (index !== -1) {
              setActiveColumnIndex(index);
            }
          }
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.6, 
      }
    );

    itemsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [columns.length]);

  // Navigasyon fonksiyonu
  const navigateToColumn = useCallback((index) => {
    if (scrollRef.current) {
      isManualScroll.current = true;
      setActiveColumnIndex(index);

      const itemWidth = 344; 
      
      // Hesaplanan hedef kaydırma pozisyonu
      const targetScroll = index * itemWidth;

      // Kaydırma işlemi
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

         // Manuel kaydırma işlemi sona erdiğinde işaretleme
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isManualScroll.current = false;
      }, 600);
    }
  }, []);

  // Veri inndirme fonksiyonu
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

  // Sürükleme olayları
  const onDragStart = (e) => {
    if (e.active.data.current?.type === "Column") setActiveCol(e.active.data.current.column);
    if (e.active.data.current?.type === "Task") setActiveTask(e.active.data.current.task);
  };


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
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={onDragStart} 
      onDragOver={onDragOver} 
      onDragEnd={onDragEnd}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[24px_24px]" />
       
         {/* Üst Başlık */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm transition-colors duration-300 select-none">
          <div className="flex h-full items-center justify-between px-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                 <Leaf size={20} className="fill-current" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                Taskflow
              </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-amber-500 dark:hover:text-amber-400 transition-all cursor-pointer"
                title={darkMode ? "Aydınlık Mod" : "Karanlık Mod"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="h-10 flex items-center">
                 <TrashDropZone count={trash.length} onClick={() => setIsTrashOpen(true)} />
              </div>
              
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block"></div>

              <button 
                  onClick={download} 
                  className="hidden sm:flex cursor-pointer active:scale-95 items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all font-medium shadow-sm"
              >
                <Download size={18} /> 
                <span>Yedekle</span>
              </button>
              
               <button 
                  onClick={download} 
                  className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              >
                <Download size={18} />
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
        
        <FloatingNav 
          columns={columns}
          tasks={tasks}
          activeColumnIndex={activeColumnIndex}
          onNavigate={navigateToColumn}
        />
          {/* Sütunlar */}
        <div 
          ref={scrollRef} 
          className="flex h-screen gap-6 overflow-x-auto px-6 sm:px-9 pt-21 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-track]:bg-transparent scroll-smooth"
        >
          <SortableContext items={columnsId}>
            {columns.map((col, index) => (
              <div 
                key={col.id} 
                ref={el => itemsRef.current[index] = el}
                className="snap-center shrink-0"
              >
                <ColumnContainer
                  column={col}
                  tasks={tasks.filter(t => t.columnId === col.id)}
                  createTask={createTask}
                  updateColumn={updateColumn}
                  deleteColumn={deleteColumn}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  moveTask={moveTask} 
                />
              </div>
            ))}
          </SortableContext>

          <div className="snap-center shrink-0">
            <button
              onClick={createNewColumn}
              className="cursor-pointer active:scale-95 flex h-[75vh] w-80 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-400 dark:text-zinc-600 transition-all group select-none"
            >
              <div className="rounded-full bg-white dark:bg-zinc-800 p-5 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400">
                <Plus size={36} />
              </div>
              <span className="mt-4 text-lg font-semibold">Yeni Liste Ekle</span>
            </button>
          </div>
        </div>

        {createPortal(
          <div className={darkMode ? "dark" : ""}> 
            <DragOverlay dropAnimation={null}>
              {activeCol && (
                <ColumnContainer 
                  column={activeCol} 
                  tasks={tasks.filter(t => t.columnId === activeCol.id)} 
                  createTask={()=>{}} 
                  updateColumn={()=>{}} 
                  deleteColumn={()=>{}} 
                  deleteTask={()=>{}} 
                  updateTask={()=>{}}
                  moveTask={()=>{}} 
                  isOverlay={true} 
                />
              )}
              {activeTask && (
                <TaskCard 
                  task={activeTask} 
                  isOverlay={true}
                  deleteTask={()=>{}} 
                  updateTask={()=>{}}
                  moveTask={()=>{}} 
                />
              )}
            </DragOverlay>
          </div>,
          document.body
        )}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;