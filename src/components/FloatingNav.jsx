import { memo, useMemo } from "react";
import { cn } from "../lib/utils";

const FloatingNav = ({ columns, tasks, activeColumnIndex, onNavigate }) => {
  
  // Her sütun için görev sayısını hesapla performansı artırmak için
  const taskCounts = useMemo(() => {
    const counts = {};
    tasks.forEach(task => {
      counts[task.columnId] = (counts[task.columnId] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  const getTaskCount = (columnId) => {
    return taskCounts[columnId] || 0;
  };

  // Sütun temasına göre renk ayarları
  const getColorTheme = (columnId) => {
    if (columnId === 'todo') return {
      dot: 'bg-blue-500 dark:bg-blue-400',
      ring: 'ring-blue-500/30 dark:ring-blue-400/30',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:bg-blue-500 dark:hover:bg-blue-400'
    };
    if (columnId === 'doing') return {
      dot: 'bg-amber-500 dark:bg-amber-400',
      ring: 'ring-amber-500/30 dark:ring-amber-400/30',
      text: 'text-amber-600 dark:text-amber-400',
      hover: 'hover:bg-amber-500 dark:hover:bg-amber-400'
    };
    if (columnId === 'done') return {
      dot: 'bg-emerald-500 dark:bg-emerald-400',
      ring: 'ring-emerald-500/30 dark:ring-emerald-400/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      hover: 'hover:bg-emerald-500 dark:hover:bg-emerald-400'
    };
    return {
      dot: 'bg-stone-400 dark:bg-neutral-500',
      ring: 'ring-stone-400/30 dark:ring-neutral-500/30',
      text: 'text-stone-600 dark:text-neutral-400',
      hover: 'hover:bg-stone-400 dark:hover:bg-neutral-500'
    };
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="flex items-center gap-4 px-6 py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-full border border-stone-200/50 dark:border-neutral-700/50 shadow-lg shadow-stone-900/5 dark:shadow-black/20">
        {columns.map((column, index) => {
          const theme = getColorTheme(column.id);
          const taskCount = getTaskCount(column.id);
          const isActive = index === activeColumnIndex;

          return (
            <button
              key={column.id}
              type="button"
              onClick={() => onNavigate(index)}
              className="group relative flex flex-col items-center gap-2 transition-all cursor-pointer"
              title={column.title}
            >
              {/* Dot */}
              <div
                className={cn(
                  "rounded-full transition-all duration-300",
                  isActive 
                    ? cn("w-3 h-3 ring-4", theme.dot, theme.ring)
                    : cn("w-2.5 h-2.5 opacity-40 group-hover:opacity-100 group-hover:scale-110", theme.dot, theme.hover)
                )}
              />

              {/* Görev Sayısı */}
              <div className={cn(
                "text-xs font-bold transition-all duration-300",
                isActive 
                  ? cn("opacity-100 scale-100", theme.text)
                  : "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 text-stone-500 dark:text-neutral-400"
              )}>
                {taskCount}
              </div>

              {/* Başlık Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-stone-800 dark:bg-neutral-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {column.title}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-800 dark:bg-neutral-700 rotate-45" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(FloatingNav);