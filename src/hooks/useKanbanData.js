import { useState } from "react";
import { useAutoSave } from "./useAutoSave";

// Kanban verilerini yönetmek için özel hook
export const useKanbanData = () => {
  const defaultColumns = [
    { id: "todo", title: "Yapılacaklar" },
    { id: "doing", title: "İşleniyor" },
    { id: "done", title: "Tamamlandı" },
  ];
// Örnek görevler
  const defaultTasks = [
    { id: "1", columnId: "todo", content: "React Öğren" },
    { id: "2", columnId: "doing", content: "Sürükle Bırak Mantığı" },
    { id: "3", columnId: "done", content: "Projeyi Kur" },
  ];
// Sütunlar, görevler ve çöp kutusu için durum yönetimi
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanban_columns");
    const parsedData = saved ? JSON.parse(saved) : defaultColumns;

    //  Eğer hafızada temel sütunlar (todo, doing, done) yoksa  onları geri ekle
    const hasTodo = parsedData.some(col => col.id === "todo");
    const hasDoing = parsedData.some(col => col.id === "doing");
    const hasDone = parsedData.some(col => col.id === "done");

    if (!hasTodo || !hasDoing || !hasDone) {

      // Eksik olanları varsayılanlardan al kullanıcının eklediği diğer sütunları koru
      const userCustomColumns = parsedData.filter(col => !["todo", "doing", "done"].includes(col.id));
      return [...defaultColumns, ...userCustomColumns];
    }

    return parsedData;
  });
// Görevler
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanban_tasks");
    return saved ? JSON.parse(saved) : defaultTasks;
  });
// Çöp kutusu
  const [trash, setTrash] = useState(() => {
    const saved = localStorage.getItem("kanban_trash");
    return saved ? JSON.parse(saved) : [];
  });

  useAutoSave(columns, tasks, trash);

// Benzersiz ID oluşturucu
  const generateId = () => Date.now().toString() + Math.floor(Math.random() * 10001);

  const createNewColumn = () => {
    const newCol = { id: generateId(), title: `Sütun ${columns.length + 1}` };
    setColumns([...columns, newCol]);
  };
// Yeni görev oluşturucu
  const createTask = (columnId) => {
    const newTask = { id: generateId(), columnId, content: "Yeni görev" };
    setTasks([...tasks, newTask]);
  };
// Sütun güncelleme
  const updateColumn = (id, newTitle) => {
    setColumns(columns.map(col => col.id === id ? { ...col, title: newTitle } : col));
  };
// Sütun silme
  const deleteColumn = (id) => {
    // Bu ID lere sahip sütunların silinmesini engelliyoruz
    if (id === "todo" || id === "doing" || id === "done") return;
    
    const column = columns.find(c => c.id === id);
    const columnTasks = tasks.filter(t => t.columnId === id);
    const trashItem = { ...column, type: "column", deletedTasks: columnTasks, deletedAt: Date.now() };
    setTrash([trashItem, ...trash]);
    setColumns(columns.filter(c => c.id !== id));
    setTasks(tasks.filter(t => t.columnId !== id));
  };
// Görev silme
  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const trashItem = { ...task, type: "task", deletedAt: Date.now() };
    setTrash([trashItem, ...trash]);
    setTasks(tasks.filter(t => t.id !== id));
  };
// Görev güncelleme
  const updateTask = (id, content) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, content } : t));
  };
// Geri yükleme
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
// Kalıcı silme
  const deletePermanently = (deletedAt) => {
    setTrash(trash.filter(t => t.deletedAt !== deletedAt));
  };
// Tüm fonksiyonları ve durumları döndürüyoruz
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