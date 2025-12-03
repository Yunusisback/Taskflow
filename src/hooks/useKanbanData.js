import { useState } from "react";
import { useAutoSave } from "./useAutoSave";


export const useKanbanData = () => {
  const defaultColumns = [
    { id: "todo", title: "Yapılacaklar" },
    { id: "doing", title: "İşleniyor" },
    { id: "done", title: "Tamamlandı" },
  ];

  const defaultTasks = [
    { id: "1", columnId: "todo", content: "React Öğren" },
    { id: "2", columnId: "doing", content: "Sürükle Bırak Mantığı" },
    { id: "3", columnId: "done", content: "Projeyi Kur" },
  ];

  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanban_columns");
    return saved ? JSON.parse(saved) : defaultColumns;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanban_tasks");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [trash, setTrash] = useState(() => {
    const saved = localStorage.getItem("kanban_trash");
    return saved ? JSON.parse(saved) : [];
  });

  useAutoSave(columns, tasks, trash);

  const generateId = () => Date.now().toString() + Math.floor(Math.random() * 10001);

  const createNewColumn = () => {
    const newCol = { id: generateId(), title: `Sütun ${columns.length + 1}` };
    setColumns([...columns, newCol]);
  };

  const createTask = (columnId) => {
    const newTask = { id: generateId(), columnId, content: "Yeni görev" };
    setTasks([...tasks, newTask]);
  };

  const updateColumn = (id, newTitle) => {
    setColumns(columns.map(col => col.id === id ? { ...col, title: newTitle } : col));
  };

  const deleteColumn = (id) => {
    const column = columns.find(c => c.id === id);
    const columnTasks = tasks.filter(t => t.columnId === id);
    const trashItem = { ...column, type: "column", deletedTasks: columnTasks, deletedAt: Date.now() };
    setTrash([trashItem, ...trash]);
    setColumns(columns.filter(c => c.id !== id));
    setTasks(tasks.filter(t => t.columnId !== id));
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const trashItem = { ...task, type: "task", deletedAt: Date.now() };
    setTrash([trashItem, ...trash]);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id, content) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, content } : t));
  };

  const restoreItem = (item) => {
    if (item.type === "column") {
      setColumns([...columns, { id: item.id, title: item.title }]);
      if (item.deletedTasks) setTasks(prev => [...prev, ...item.deletedTasks]);
    } else if (item.type === "task") {
      const targetCol = columns.find(c => c.id === item.columnId) ? item.columnId : columns[0]?.id || "todo";
      setTasks(prev => [...prev, { ...item, columnId: targetCol }]);
    }
    setTrash(trash.filter(t => t.deletedAt !== item.deletedAt));
  };

  const deletePermanently = (deletedAt) => {
    setTrash(trash.filter(t => t.deletedAt !== deletedAt));
  };

  return {
    columns,
    setColumns,   
    tasks,
    setTasks,    
    trash,
    createNewColumn,
    createTask,
    updateColumn,
    deleteColumn,
    deleteTask,
    updateTask,
    restoreItem,
    deletePermanently,
  };
};