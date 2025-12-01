import { useMemo, useState, useRef } from "react";
import ColumnContainer from "./ColumnContainer";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

// Kanban Tahtası Bileşeni
const KanbanBoard = () => {
  const scrollContainerRef = useRef(null);
  
  const [columns, setColumns] = useState([
    { id: "todo", title: "Yapılacaklar" },
    { id: "doing", title: "İşleniyor" },
    { id: "done", title: "Tamamlandı" },
  ]);

  // Tüm görevler
  const [tasks, setTasks] = useState([
    { id: "1", columnId: "todo", content: "React Öğren" },
    { id: "2", columnId: "doing", content: "Sürükle Bırak Mantığı" },
    { id: "3", columnId: "done", content: "Projeyi Kur" },
  ]);

  // Sürüklenen aktif sütun veya görev
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  // Sütun ID leri (sıralama için)
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // dnd-kit Sensörleri (Fare hareketi algılayıcı)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Yeni sütun oluşturma fonksiyonu
  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Sütun ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  // Sütun silme fonksiyonu
  function deleteColumn(id) {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((t) => t.columnId !== id));
  }

  // Yeni görev oluşturma fonksiyonu
  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Yeni Görev ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  // Görev silme fonksiyonu
  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // Görev güncelleme fonksiyonu
  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  }

  // Rastgele ID oluşturma fonksiyonu
  function generateId() {
    return Math.floor(Math.random() * 10001).toString();
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Sürükleme başladığında aktif elemanı ayarla
  function onDragStart(event) {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = 'auto';
    }
    
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  // Sürükleme sırasında görevlerin yerini değiştir
  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  // Sürükleme bittiğinde aktif elemanı sıfırla ve sütunları yeniden sırala
  function onDragEnd(event) {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
    }
    
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Sadece sütunların yerini değiştir
    const isActiveColumn = active.data.current?.type === "Column";
    if (isActiveColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId
        );
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center justify-start overflow-hidden px-[40px] bg-neutral-950 text-white font-sans relative">
      <div className="fixed inset-0 z-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-neutral-950 to-neutral-950"></div>
      <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      
      {/* Sol Ok Butonu */}
      <button
        onClick={scrollLeft}
        className="fixed left-4 z-20 p-3 rounded-full bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 backdrop-blur-xl border border-neutral-700/50 text-neutral-400 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 active:shadow-lg cursor-pointer"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Sağ Ok Butonu */}
      <button
        onClick={scrollRight}
        className="fixed right-4 z-20 p-3 rounded-full bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 backdrop-blur-xl border border-neutral-700/50 text-neutral-400 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 active:shadow-lg cursor-pointer"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Ana İçerik */}
      <div ref={scrollContainerRef} className="z-10 flex gap-6 py-12 overflow-x-auto overflow-y-hidden w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth will-change-scroll">
        
        {/* Dndcontext ile sürükle bırak işlevselliğini sağla */}
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex gap-6">
            {/* Sütunları sıralanabilir konteyner içinde göster */}
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>

            <button
              onClick={createNewColumn}
              className="h-[70px] w-[380px] min-w-[380px] cursor-pointer rounded-3xl bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl border-2 border-dashed border-neutral-700/50 p-4 flex gap-3 items-center justify-center text-neutral-500 hover:text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all duration-300 group"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold text-lg">Sütun Ekle</span>
            </button>
          </div>

          {/* Sürükleme sırasında üstte gösterilecek eleman */}
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                />
              )}
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;