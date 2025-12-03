import { useEffect } from "react";

// Bu hook verileri alır ve değiştiği an LocalStorage a yazar
export const useAutoSave = (columns, tasks, trash) => {
  
  useEffect(() => {
    localStorage.setItem("kanban_columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("kanban_trash", JSON.stringify(trash));
  }, [trash]);
  
};