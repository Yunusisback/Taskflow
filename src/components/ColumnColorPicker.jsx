import { memo } from "react";
import { cn } from "../lib/utils";
import { colorPalette } from "../constants/columnColors";

const ColumnColorPicker = ({ show, currentColor, onColorChange }) => {
  if (!show) return null;

  return (
    <div className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 animate-in fade-in zoom-in-95 duration-200 min-w-[150px]">
      {/* Ok işareti  */}
      <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white dark:bg-zinc-800 border-t border-l border-zinc-200 dark:border-zinc-700 rotate-45"></div>

      {/* 3x3 Renk ızgarası */}
      <div className="grid grid-cols-3 gap-2 relative z-10">
        {colorPalette.map((color) => {
          const isSelected = currentColor === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onColorChange(color.id)}
              className={cn(
                "w-8 h-8 rounded-lg transition-all hover:scale-105 active:scale-95 relative shadow-sm",
                color.bg,
                isSelected && "ring-2 ring-zinc-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-zinc-800 scale-105 z-10"
              )}
              title={color.name}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ColumnColorPicker);