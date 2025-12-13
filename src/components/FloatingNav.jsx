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

  // Sütun temasına göre renk ayarları (dark modda daha canlı)
  const getColorTheme = (columnId) => {
    if (columnId === 'todo') return {
      dot: 'bg-blue-500',
      activeDot: 'bg-blue-500 shadow-lg shadow-blue-500/50',
      ring: 'ring-blue-400/30',
      text: 'text-blue-600 dark:text-blue-400',
    };
    if (columnId === 'doing') return {
      dot: 'bg-amber-500',
      activeDot: 'bg-amber-500 shadow-lg shadow-amber-500/50',
      ring: 'ring-amber-400/30',
      text: 'text-amber-600 dark:text-amber-400',
    };
    if (columnId === 'done') return {
      dot: 'bg-emerald-500',
      activeDot: 'bg-emerald-500 shadow-lg shadow-emerald-500/50',
      ring: 'ring-emerald-400/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    };
    return {
      dot: 'bg-zinc-400 dark:bg-neutral-500',
      activeDot: 'bg-zinc-500 dark:bg-neutral-400 shadow-lg shadow-zinc-500/40',
      ring: 'ring-zinc-400/30',
      text: 'text-zinc-600 dark:text-neutral-400',
    };
  };

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-none">
   
      <div className="relative group">

 
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-amber-500/20 to-emerald-500/20 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500" />
        
        {/* Main container  */}
        <div className="relative flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-2.5 sm:py-3 bg-white/10 dark:bg-black/10 backdrop-blur-2xl rounded-full border border-white/20 dark:border-white/10 shadow-2xl pointer-events-auto">
          
          {columns.map((column, index) => {
            const theme = getColorTheme(column.id);
            const taskCount = getTaskCount(column.id);
            const isActive = index === activeColumnIndex;

            return (
              <button
                key={column.id}
                type="button"
                onClick={() => onNavigate(index)}
                className="group/btn relative flex flex-col items-center gap-1 transition-all cursor-pointer active:scale-95 hover:scale-110"
                title={column.title}
              >
                {/* dot containner */}
                <div className="relative flex items-center justify-center">

                  {/* active ring */}
                  {isActive && (
                    <div className={cn(
                      "absolute inset-0 rounded-full ring-4 animate-pulse",
                      theme.ring
                    )} />
                  )}
                  
                  {/* dot */}
                  <div
                    className={cn(
                      "rounded-full transition-all duration-300",
                      isActive 
                        ? cn("w-3 h-3 sm:w-3.5 sm:h-3.5", theme.activeDot)
                        : cn("w-2 h-2 sm:w-2.5 sm:h-2.5 opacity-50 group-hover/btn:opacity-100", theme.dot)
                    )}
                  />
                  
                  {/* pulse effect */}
                  {isActive && (
                    <div className={cn(
                      "absolute inset-0 rounded-full animate-ping opacity-75",
                      theme.dot
                    )} />
                  )}
                </div>

                {/* Görev sayısı */}
                <div className={cn(
                  "text-xs sm:text-sm font-bold transition-all duration-300 tabular-nums",
                  isActive 
                    ? cn("opacity-100 scale-100", theme.text)
                    : "opacity-60 group-hover/btn:opacity-100 text-zinc-700 dark:text-neutral-300"
                )}>
                  {taskCount}
                </div>

                 {/*  Sütun başlığı hover efekti */}
                <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900/90 dark:bg-zinc-800/90 backdrop-blur-xl text-white text-xs rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl scale-95 group-hover/btn:scale-100">
                  {column.title}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900/90 dark:bg-zinc-800/90 rotate-45" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(FloatingNav);