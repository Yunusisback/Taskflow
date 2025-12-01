import { useState } from "react";
import { Trash2 } from "lucide-react";
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
        className="
        opacity-30
        bg-neutral-800 
        p-2.5 
        h-[100px] 
        min-h-[100px] 
        items-center 
        flex 
        text-left 
        rounded-xl 
        border-2 
        border-rose-500  
        cursor-grab 
        relative
      "
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
        className="
        bg-neutral-900
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        flex
        text-left
        rounded-xl
        hover:ring-2
        hover:ring-inset
        hover:ring-rose-500
        cursor-grab
        relative
      "
      >
        {/*  Görev içeriği için düzenlenebilir alan */}
        <textarea
          className="
            h-[90%]
            w-full resize-none border-none rounded bg-transparent text-white focus:outline-none
          "
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
      className="
        bg-neutral-900
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        flex
        text-left
        rounded-xl
        hover:ring-2
        hover:ring-inset
        hover:ring-rose-500
        cursor-grab
        relative
        task
      "
      // Fare üzerine gelme olayları
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
     
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words">
        {task.content}
      </p>

      {/*  Silme butonunu sadece fare üzerine gelince göster */}
      {mouseIsOver && (
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            deleteTask(task.id);
          }}
          className="
            stroke-white
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            bg-neutral-900
            p-2
            rounded
            opacity-60
            hover:opacity-100
          "
        >
          <Trash2 />
        </button>
      )}
    </div>
  );
};

export default TaskCard;