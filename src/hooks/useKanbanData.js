import { useState } from "react";
import { useAutoSave } from "./useAutoSave";

export const useKanbanData = () => {
  const defaultColumns = [
    { id: "todo", title: "Yapılacaklar" },
    { id: "doing", title: "İşleniyor" },
    { id: "done", title: "Tamamlandı" },
  ];

  const defaultTasks = [];

  // Sütunları başlatma mantığı 
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanban_columns");
    const parsedData = saved ? JSON.parse(saved) : [];

    //  Varsayılan sütunları her zaman ekle
    const userCustomColumns = parsedData.filter(col =>
      col.id !== "todo" && col.id !== "doing" && col.id !== "done"
    );

    // Varsayılan sütunları en başta tutarak geri kalan kullanıcı sütunlarını ekle
    return [...defaultColumns, ...userCustomColumns];
  });

  // Görevleri başlatma mantığı
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanban_tasks");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  // Çöp kutusu verileri
  const [trash, setTrash] = useState(() => {
    const saved = localStorage.getItem("kanban_trash");
    return saved ? JSON.parse(saved) : [];
  });

  useAutoSave(columns, tasks, trash);

  const generateId = () => Date.now().toString() + Math.floor(Math.random() * 10001);

  // Yeni sütun oluştur
  const createNewColumn = () => {
    const newCol = { id: generateId(), title: `Liste ${columns.length - 2}` }; 
    setColumns([...columns, newCol]);
  };

  // Yeni görev oluştur
  const createTask = (columnId) => {
    const newTask = { id: generateId(), columnId, content: "Yeni görev" };
    setTasks([...tasks, newTask]);
  };

  // Sütun başlığını güncelle
  const updateColumn = (id, newTitle) => {
    setColumns(columns.map(col => col.id === id ? { ...col, title: newTitle } : col));
  };

  const deleteColumn = (id) => {
    // Ana sütunlar asla silinemez
    if (id === "todo" || id === "doing" || id === "done") return;

    const column = columns.find(c => c.id === id);
    const columnTasks = tasks.filter(t => t.columnId === id);
    const trashItem = { ...column, type: "column", deletedTasks: columnTasks, deletedAt: Date.now() };
    setTrash([trashItem, ...trash]);
    setColumns(columns.filter(c => c.id !== id));
    setTasks(tasks.filter(t => t.columnId !== id));
  };

  // Görevi sil ve çöp kutusuna at
  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const trashItem = { ...task, type: "task", deletedAt: Date.now() };
    setTrash([trashItem, ...trash]);
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Görevi güncelle
  const updateTask = (id, content) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, content } : t));
  };

  //  Görevi başka sütuna taşı
  const moveTask = (taskId, targetColumnId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, columnId: targetColumnId } : t
    ));
  };
  //  Çöp kutusu işlemleri
  const restoreItem = (item) => {
    if (item.type === "column") {
      setColumns([...columns, { id: item.id, title: item.title }]);
      if (item.deletedTasks) setTasks(prev => [...prev, ...item.deletedTasks]);
    } else if (item.type === "task") {
      const targetCol = columns.find(c => c.id === item.columnId) ? item.columnId : "todo";
      setTasks(prev => [...prev, { ...item, columnId: targetCol }]);
    }
    setTrash(trash.filter(t => t.deletedAt !== item.deletedAt));
  };
  // Çöp kutusundan kalıcı sil
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
    moveTask,
    restoreItem,
    deletePermanently,
  };
};