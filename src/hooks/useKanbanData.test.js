import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useKanbanData } from './useKanbanData';

describe('useKanbanData Hook', () => {
  
  // Her testten önce LocalStorage ı temizleyelim
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('varsayılan verilerle (todo, doing, done) başlamalı', () => {
    const { result } = renderHook(() => useKanbanData());

    expect(result.current.columns).toHaveLength(3);
    expect(result.current.columns[0].id).toBe('todo');
    expect(result.current.tasks).toHaveLength(3); 
    expect(result.current.trash).toHaveLength(0);
  });

  it('yeni sütun ekleyebilmeli', () => {
    const { result } = renderHook(() => useKanbanData());

    act(() => {
      result.current.createNewColumn();
    });

    expect(result.current.columns).toHaveLength(4);
    // useKanbanData.js'de "Liste" kullanıyor, "Sütun" değil
    expect(result.current.columns[3].title).toContain('Liste');
  });

  it('yeni görev ekleyebilmeli', () => {
    const { result } = renderHook(() => useKanbanData());

    act(() => {
      result.current.createTask('todo');
    });

    expect(result.current.tasks).toHaveLength(4); // 3 varsayılan + 1 yeni
    const newTask = result.current.tasks[result.current.tasks.length - 1];
    expect(newTask.columnId).toBe('todo');
    expect(newTask.content).toBe('Yeni görev');
  });

  it('görev güncelleyebilmeli', () => {
    const { result } = renderHook(() => useKanbanData());
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, 'Güncellenmiş İçerik');
    });

    const updatedTask = result.current.tasks.find(t => t.id === taskId);
    expect(updatedTask.content).toBe('Güncellenmiş İçerik');
  });

  it('sütun başlığını güncelleyebilmeli', () => {
    const { result } = renderHook(() => useKanbanData());

    act(() => {
      result.current.updateColumn('todo', 'Yapılacaklar Listesi');
    });

    const todoCol = result.current.columns.find(c => c.id === 'todo');
    expect(todoCol.title).toBe('Yapılacaklar Listesi');
  });

  it('görev silebilmeli (Çöp kutusuna taşımalı)', () => {
    const { result } = renderHook(() => useKanbanData());
    const taskToDelete = result.current.tasks[0];

    act(() => {
      result.current.deleteTask(taskToDelete.id);
    });

    // Görevler listesinden kalkmalı
    expect(result.current.tasks.find(t => t.id === taskToDelete.id)).toBeUndefined();
    
    // Çöp kutusuna gelmeli
    expect(result.current.trash).toHaveLength(1);
    expect(result.current.trash[0].id).toBe(taskToDelete.id);
  });

  it('sütun silebilmeli (Çöp kutusuna taşımalı)', () => {
    const { result } = renderHook(() => useKanbanData());
    
    // Önce yeni bir sütun ekleyelim (varsayılanlar silinemiyor çünkü)
    act(() => {
      result.current.createNewColumn();
    });
    
    const newColId = result.current.columns[3].id;

    act(() => {
      result.current.deleteColumn(newColId);
    });

    expect(result.current.columns).toHaveLength(3); // Tekrar 3 e düşmeli
    expect(result.current.trash).toHaveLength(1);
    expect(result.current.trash[0].id).toBe(newColId);
  });

  it('çöp kutusundan geri yükleme yapabilmeli (Restore)', () => {
    const { result } = renderHook(() => useKanbanData());
    const taskToDelete = result.current.tasks[0];

    // Sil
    act(() => {
      result.current.deleteTask(taskToDelete.id);
    });

    const deletedItem = result.current.trash[0];

    // Geri Yükle
    act(() => {
      result.current.restoreItem(deletedItem);
    });

    expect(result.current.trash).toHaveLength(0);
    expect(result.current.tasks.find(t => t.id === taskToDelete.id)).toBeDefined();
  });

  it('kalıcı olarak silebilmeli', () => {
    const { result } = renderHook(() => useKanbanData());
    const taskToDelete = result.current.tasks[0];

    // Sil
    act(() => {
      result.current.deleteTask(taskToDelete.id);
    });

    const deletedItem = result.current.trash[0];

    // Kalıcı Sil
    act(() => {
      result.current.deletePermanently(deletedItem.deletedAt);
    });

    expect(result.current.trash).toHaveLength(0);
  
  });
});