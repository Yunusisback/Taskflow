import { useMemo } from "react";

export const useTaskTheme = (columnTheme) => {
  // Dinamik hover rengi belirleme
  const ringColor = useMemo(() => {
    switch (columnTheme) {
      case 'blue': return 'focus-within:ring-blue-500/50 hover:border-blue-300 dark:hover:border-blue-700';
      case 'amber': return 'focus-within:ring-amber-500/50 hover:border-amber-300 dark:hover:border-amber-700';
      case 'emerald': return 'focus-within:ring-emerald-500/50 hover:border-emerald-300 dark:hover:border-emerald-700';
      default: return 'focus-within:ring-zinc-400/50 hover:border-zinc-400 dark:hover:border-zinc-600';
    }
  }, [columnTheme]);

  // Scroll bar renkleri 
  const scrollbarColor = useMemo(() => {
    switch (columnTheme) {
      case 'blue': return '[&::-webkit-scrollbar-thumb]:bg-blue-400 dark:[&::-webkit-scrollbar-thumb]:bg-blue-500';
      case 'amber': return '[&::-webkit-scrollbar-thumb]:bg-amber-400 dark:[&::-webkit-scrollbar-thumb]:bg-amber-500';
      case 'emerald': return '[&::-webkit-scrollbar-thumb]:bg-emerald-400 dark:[&::-webkit-scrollbar-thumb]:bg-emerald-500';
      default: return '[&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600';
    }
  }, [columnTheme]);

  return { ringColor, scrollbarColor };
};