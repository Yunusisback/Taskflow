import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { Plus } from "lucide-react";
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
      content: `Görev ${tasks.length + 1}`,
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

// Sürükleme başladığında aktif elemanı ayarla
  function onDragStart(event) {
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
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        justify-start
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
      >  
     {/*  Dndcontext ile sürükle bırak işlevselliğini sağla */}
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4">

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
            className="
            h-[60px]
            w-[350px]
            min-w-[350px]
            cursor-pointer
            rounded-lg
            bg-neutral-800
            border-2
            border-neutral-800
            p-4
            ring-rose-500
            hover:ring-2
            flex
            gap-2
            items-center
            font-bold
            transition-all
            "
          >
            <Plus />
            Sütun Ekle
          </button>
        </div>

      {/*  Sürükleme sırasında üstte gösterilecek eleman */}
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
  );
};

export default KanbanBoard;