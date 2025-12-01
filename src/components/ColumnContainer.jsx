import { useMemo } from "react";
import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Trash2, Plus, GripVertical } from "lucide-react";
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
        className="bg-neutral-800/30 backdrop-blur-sm opacity-40 border-2 border-dashed border-rose-500/60 w-[380px] h-[600px] rounded-3xl shadow-2xl"
      ></div>
    );
  }

  
  // Normal modda sütun içeriğini göster
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 backdrop-blur-xl w-[320px] h-[550px] rounded-3xl flex flex-col border border-neutral-700/30 shadow-2xl hover:shadow-rose-500/5 transition-all duration-300 shrink-0"
    >
     
      <div
        {...attributes}
        {...listeners} 
        onClick={() => {
         
        }}
        className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm h-[70px] cursor-grab active:cursor-grabbing rounded-3xl rounded-b-2xl p-4 border-b border-neutral-700/50 flex items-center justify-between group hover:border-rose-500/30 transition-all duration-300"
      >
        <div className="flex gap-3 items-center">
         
          <div className="opacity-0 group-hover:opacity-60 transition-opacity duration-200">
            <GripVertical size={20} className="text-neutral-400" />
          </div>
          
          <div className="flex justify-center items-center bg-gradient-to-br from-rose-500/20 to-rose-600/20 backdrop-blur-sm px-3 py-1.5 text-sm rounded-full border border-rose-500/30 text-rose-300 font-semibold shadow-lg shadow-rose-500/10">
            {tasks.length}
          </div>
          
          <span className="font-bold text-lg text-neutral-100">{column.title}</span>
        </div>
        
     
        <button
          onClick={() => deleteColumn(column.id)}
          className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all duration-200"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-3 p-4 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

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
      <div className="p-4 border-t border-neutral-700/30">
        <button
          onClick={() => createTask(column.id)}
          className="flex gap-2 items-center justify-center w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 text-neutral-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all duration-300 font-medium group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Görev Ekle</span>
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;