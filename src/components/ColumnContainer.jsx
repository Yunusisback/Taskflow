import { useMemo } from "react";
import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Trash2, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sütun bileşeni
const ColumnContainer = ({ 
  column, 
  deleteColumn,  
  createTask, 
  tasks, 
  deleteTask, 
  updateTask 
}) => {
  

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

// dnd-kit Hooku 
// bu elemanı Sürüklenebilir (Sortable) yapar
/// kullanıcı sütunu tuttuğunda orijinal yerinde silik bir kutu gösteririz
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column", 
      column,
    },
  });

  // CSS stili (Sürükleme sırasındaki hareket ve animasyon)
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

 // Sürüklenirken arkada kalan boşluk
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        bg-neutral-800
        opacity-40
        border-2
        border-rose-500
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        "
      ></div>
    );
  }

  
  // Normal modda sütun içeriğini göster
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-neutral-800
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        shrink-0 
      "
    >
     
      <div
        {...attributes}
        {...listeners} 
        onClick={() => {
         
        }}
        className="
            bg-neutral-900
            text-md
            h-[60px]
            cursor-grab
            rounded-md
            rounded-b-none
            p-3
            font-bold
            border-neutral-800
            border-4
            flex
            items-center
            justify-between
        "
      >
        <div className="flex gap-2">
         
          <div className="
            flex
            justify-center
            items-center
            bg-neutral-900
            px-2
            py-1
            text-sm
            rounded-full
          ">
            {tasks.length}
          </div>
          {column.title}
        </div>
        
     
        <button
          onClick={() => deleteColumn(column.id)}
          className="
            stroke-gray-500
            hover:stroke-white
            hover:bg-neutral-800
            rounded
            px-1
            py-2
            "
        >
            <Trash2 size={20} />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">

         {/*  Görevleri sırala ve göster */}

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
      </div>

      {/*  Görev ekleme butonu */}
      <div className="p-2 border-t border-neutral-900">
        <button
          onClick={() => createTask(column.id)}
          className="flex gap-2 items-center border-neutral-800 border-2 rounded-md p-4 w-full hover:bg-neutral-900 hover:text-rose-500 transition-colors"
        >
          <Plus /> Görev Ekle
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;