import { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable"; 
import { CSS } from "@dnd-kit/utilities"; 

// Görev Kartı Bileşeni
const TaskCard = ({ task, deleteTask, updateTask }) => {

// Fare üzerine gelme durumu
  const [mouseIsOver, setMouseIsOver] = useState(false);

  // Düzenleme modu durumu
  const [editMode, setEditMode] = useState(false);

// dnd-kit Hooku 
  const {
    setNodeRef,  
    attributes,  
    listeners,    
    transform,   
    transition,  
    isDragging,   
  } = useSortable({
    id: task.id,
    data: {
      type: "Task", 
      task,
    },
    disabled: editMode,
  });

 // CSS stili (Sürükleme sırasındaki hareket ve animasyon)
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

// Düzenleme modunu açma/kapatma fonksiyonu
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

// Sürüklenirken arkada kalan boşluk 
// görev kartı yerine silik bir kutu gösteririz
// böylece kullanıcı nereye sürüklediğini görebilir
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-neutral-800 p-2.5 h-[100px] min-h-[100px] rounded-lg border border-dashed border-rose-500"
      />
    );
  }

// Düzenleme modundayken textarea göster
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-neutral-800 p-3 h-[100px] min-h-[100px] rounded-lg border border-rose-500/50 shadow-lg"
      >
        {/* Görev içeriği için düzenlenebilir alan */}
        <textarea
          className="h-full w-full resize-none border-none rounded bg-transparent text-white focus:outline-none placeholder:text-neutral-500 text-sm leading-relaxed font-normal [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          value={task.content}
          autoFocus
          placeholder="Görev içeriği..."
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); 
              toggleEditMode();   
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

// Normal modda görev kartını göster
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="group bg-neutral-800 hover:bg-neutral-800 backdrop-blur-sm p-3 min-h-[80px] rounded-lg border border-transparent hover:border-neutral-700/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing relative overflow-hidden task"
      // Fare üzerine gelme olayları
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
        {/*  Sürükleme ikonu ve görev içeriği */}
      
      <div className="flex items-start gap-2 h-full">
        <div className="mt-1 opacity-0 group-hover:opacity-40 transition-opacity duration-200">
          <GripVertical size={14} className="text-neutral-400" />
        </div>
        
          {/* Görev içeriği */}
        <p className="flex-1 text-neutral-300 text-sm whitespace-pre-wrap break-words leading-relaxed my-auto h-[90%] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {task.content}
        </p>
      </div>

      {/* Silme butonunu sadece fare üzerine gelince göster */}
      {mouseIsOver && (
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            deleteTask(task.id);
          }}
          className="absolute right-2 top-2 p-1.5 rounded-md bg-neutral-900/80 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default TaskCard;