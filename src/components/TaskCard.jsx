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
        className="opacity-40 bg-gradient-to-br from-neutral-800 to-neutral-900 p-2.5 h-[100px] min-h-[100px] rounded-xl border-2 border-dashed border-rose-500/60"
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
        className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm p-2.5 h-[100px] min-h-[100px] rounded-xl border border-rose-500/30 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 transition-all duration-300"
      >
        {/*  Görev içeriği için düzenlenebilir alan */}
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none placeholder:text-neutral-500"
          value={task.content}
          autoFocus
          placeholder="Görev içeriği..."
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
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
      className="group bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 backdrop-blur-sm pl-0.5 p-2.5 h-[100px] min-h-[100px] rounded-xl border border-neutral-700/50 shadow-lg hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-500/40 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-[1.04] relative overflow-hidden task"
      // Fare üzerine gelme olayları
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-start gap-2">
        <div className="opacity-0 group-hover:opacity-60 transition-opacity duration-200 mt-1">
          <GripVertical size={14} className="text-neutral-400" />
        </div>
        
        <p className="flex-1 text-neutral-200 text-sm whitespace-pre-wrap break-words leading-relaxed my-auto h-[90%] overflow-y-auto overflow-x-hidden">
          {task.content}
        </p>
      </div>

      {/*  Silme butonunu sadece fare üzerine gelince göster */}
      {mouseIsOver && (
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            deleteTask(task.id);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default TaskCard;