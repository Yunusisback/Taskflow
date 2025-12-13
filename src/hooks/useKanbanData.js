import { useState, useCallback } from "react";
import { useAutoSave } from "./useAutoSave";

export const useKanbanData = () => {
  const defaultColumns = [
    { id: "todo", title: "Yapılacaklar" },
    { id: "doing", title: "İşleniyor" },
    { id: "done", title: "Tamamlandı" },
  ];

  const defaultTasks = [];

  // Güvenli localStorage okuma fonksiyonu 
  const safeGetItem = useCallback((key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);

      if (!saved || saved === 'undefined' || saved === 'null') {
        return defaultValue;
      }

      const parsed = JSON.parse(saved);

      // Veri tipi validasyonu
      if (!Array.isArray(parsed)) {
        console.warn(`${key} için geçersiz veri formatı`);
        return defaultValue;
      }

      return parsed;

    } catch (error) {
      console.error(`${key} okuma hatası:`, error);

      // Bozuk veriyi temizle
      try {
        localStorage.removeItem(key);
      } catch (cleanupError) {
        console.error(`Veri temizleme hatası:`, cleanupError);
      }

      return defaultValue;
    }
  }, []);

  // Sütunları başlatma mantığı 
  const [columns, setColumns] = useState(() => {
    const parsedData = safeGetItem("kanban_columns", []);

    //  Varsayılan sütunları her zaman ekle
    const userCustomColumns = parsedData.filter(col =>
      col && col.id && col.title &&
      col.id !== "todo" && col.id !== "doing" && col.id !== "done"
    );

    // Varsayılan sütunları en başta tutarak geri kalan kullanıcı sütunlarını ekle
    return [...defaultColumns, ...userCustomColumns];
  });

  // Görevleri başlatma mantığı
  const [tasks, setTasks] = useState(() => {
    const loadedTasks = safeGetItem("kanban_tasks", defaultTasks);

    //  Görev validasyonu
    return loadedTasks.filter(task =>
      task && task.id && task.columnId && task.content !== undefined
    );
  });

  // Çöp kutusu verileri
  const [trash, setTrash] = useState(() => {
    return safeGetItem("kanban_trash", []);
  });

  useAutoSave(columns, tasks, trash);

  // daha güvenli ID oluşturma
  const generateId = useCallback(() => {

    // Modern tarayıcılarda crypto.randomUUID 
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // Yeni sütun oluştur
  const createNewColumn = useCallback(() => {

    setColumns(prevColumns => {
      const customColumnsCount = prevColumns.filter(
        col => col.id !== "todo" && col.id !== "doing" && col.id !== "done"
      ).length;

      const newCol = {
        id: generateId(),
        title: `Liste ${customColumnsCount + 1}`
      };
      return [...prevColumns, newCol];
    });
  }, [generateId]);

  // Yeni görev oluştur
  const createTask = useCallback((columnId) => {

    const columnExists = columns.some(col => col.id === columnId);
    if (!columnExists) {
      console.error(`Sütun bulunamadı: ${columnId}`);
      return;
    }

    const newTask = {
      id: generateId(),
      columnId,
      content: "Yeni görev"
    };
    setTasks(prev => [...prev, newTask]);
  }, [columns, generateId]);

  // Sütun başlığını veya rengini güncelle 
  const updateColumn = useCallback((id, newTitle, color = null) => {

    if (!newTitle || !newTitle.trim()) {
      console.warn("Sütun başlığı boş olamaz");

      if (color === null) return;
    }

    setColumns(cols =>
      cols.map(col => {
        if (col.id !== id) return col;


        const updatedCol = {
          ...col,
          title: newTitle.trim(),
        };

        // Renk parametresi tanımlı ise rengi güncelle
        if (color !== null) {
          updatedCol.color = color;
        }

        return updatedCol;
      })
    );
  }, []);

  const deleteColumn = (id) => {

    // Ana sütunlar asla silinemez
    if (id === "todo" || id === "doing" || id === "done") return;

    const column = columns.find(c => c.id === id);
    if (!column) return;

    const columnTasks = tasks.filter(t => t.columnId === id);
    const trashItem = { ...column, type: "column", deletedTasks: columnTasks, deletedAt: Date.now() };
    setTrash([trashItem, ...trash]);
    setColumns(columns.filter(c => c.id !== id));
    setTasks(tasks.filter(t => t.columnId !== id));
  };

  // Görevi sil ve çöp kutusuna at
  const deleteTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const trashItem = { ...task, type: "task", deletedAt: Date.now() };

    setTrash(prev => [trashItem, ...prev]);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, [tasks]);

  // Görevi güncelle
  const updateTask = useCallback((id, content) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, content, lastEdited: Date.now() }
          : t
      )
    );
  }, []);

  //  Görevi başka sütuna taşı
  const moveTask = useCallback((taskId, targetColumnId) => {

    const targetExists = columns.some(col => col.id === targetColumnId);
    if (!targetExists) {
      console.error(`Hedef sütun bulunamadı: ${targetColumnId}`);
      return;
    }

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, columnId: targetColumnId }
          : t
      )
    );
  }, [columns]);

  //  Çöp kutusu işlemleri
  const restoreItem = useCallback((item) => {
    if (!item) return;

    if (item.type === "column") {

      setColumns(prev => [...prev, { id: item.id, title: item.title, color: item.color }]);
      if (item.deletedTasks) setTasks(prev => [...prev, ...item.deletedTasks]);
    } else if (item.type === "task") {
      const targetCol = columns.find(c => c.id === item.columnId) ? item.columnId : "todo";
      setTasks(prev => [...prev, { ...item, columnId: targetCol }]);
    }
    setTrash(prev => prev.filter(t => t.deletedAt !== item.deletedAt));
  }, [columns]);

  // Çöp kutusundan kalıcı sil
  const deletePermanently = useCallback((deletedAt) => {
    setTrash(prev => prev.filter(t => t.deletedAt !== deletedAt));
  }, []);

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