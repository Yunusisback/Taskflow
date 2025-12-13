import { useEffect, useRef, useCallback, useState } from "react";


export const useAutoSave = (columns, tasks, trash) => {

  // Debounce timerları
  const saveTimerColumns = useRef(null);
  const saveTimerTasks = useRef(null);
  const saveTimerTrash = useRef(null);

  // Kayıt durumları
  const [saveStatus, setSaveStatus] = useState({
    isSaving: false,
    lastSaved: null,
    error: null
  });

  // localStorage kapasitesini kontrol et
  const checkStorageQuota = useCallback(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        const percentUsed = (estimate.usage / estimate.quota) * 100;
        if (percentUsed > 90) {
          console.warn(`localStorage %${percentUsed.toFixed(1)} dolu!`);
        }
      });
    }
  }, []);

  // Güvenli localStorage yazma fonksiyonu
  const safeSetItem = useCallback((key, value) => {
    try {
      const jsonString = JSON.stringify(value);


      localStorage.setItem(key, jsonString);

      // Başarılı kayıt
      setSaveStatus({
        isSaving: false,
        lastSaved: new Date(),
        error: null
      });

      return true;
    } catch (error) {
      console.error(`${key} kaydedilirken hata:`, error);

      // Hata tipine göre mesaj
      let errorMessage = "Kaydetme hatası";

      if (error.name === 'QuotaExceededError') {
        errorMessage = "Depolama alanı dolu! Eski verilerinizi temizleyin.";
        checkStorageQuota();
      } else if (error.name === 'SecurityError') {
        errorMessage = "Gizli modda localStorage kullanılamıyor.";
      }

      setSaveStatus({
        isSaving: false,
        lastSaved: null,
        error: errorMessage
      });

      return false;
    }
  }, [checkStorageQuota]);

  // Debounced kaydetme fonksiyonu
  const debouncedSave = useCallback((key, value, timerRef, delay = 800) => {

    // Önceki timer ı iptal et
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Kaydediliyor durumunu göster
    setSaveStatus(prev => ({ ...prev, isSaving: true }));

    // Yeni timer başlat
    timerRef.current = setTimeout(() => {
      safeSetItem(key, value);
    }, delay);
  }, [safeSetItem]);

  // Sütunları kaydet
  useEffect(() => {
    debouncedSave("kanban_columns", columns, saveTimerColumns);
  }, [columns, debouncedSave]);

  // Görevleri kaydet
  useEffect(() => {
    debouncedSave("kanban_tasks", tasks, saveTimerTasks);
  }, [tasks, debouncedSave]);

  // Çöp kutusunu kaydet
  useEffect(() => {
    debouncedSave("kanban_trash", trash, saveTimerTrash);
  }, [trash, debouncedSave]);

  // Sayfa kapanırken son değişiklikleri kaydet
  useEffect(() => {
    const handleBeforeUnload = () => {

      // Timerları iptal et ve hemen kaydet
      if (saveTimerColumns.current) {
        clearTimeout(saveTimerColumns.current);
        safeSetItem("kanban_columns", columns);
      }
      if (saveTimerTasks.current) {
        clearTimeout(saveTimerTasks.current);
        safeSetItem("kanban_tasks", tasks);
      }
      if (saveTimerTrash.current) {
        clearTimeout(saveTimerTrash.current);
        safeSetItem("kanban_trash", trash);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [columns, tasks, trash, safeSetItem]);

  // Bileşen unmount olduğunda timerları temizle
  useEffect(() => {
    return () => {
      if (saveTimerColumns.current) clearTimeout(saveTimerColumns.current);
      if (saveTimerTasks.current) clearTimeout(saveTimerTasks.current);
      if (saveTimerTrash.current) clearTimeout(saveTimerTrash.current);
    };
  }, []);

  // Hata mesajını 5 saniye sonra temizle
  useEffect(() => {
    if (saveStatus.error) {
      const timer = setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, error: null }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [saveStatus.error]);

  return saveStatus;
};