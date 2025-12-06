import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAutoSave } from '../../hooks/useAutoSave';

describe('useAutoSave Hook', () => {
  beforeEach(() => {
    
    // LocalStorage mock'unu temizle
    vi.spyOn(Storage.prototype, 'setItem');
  });

  it('veriler değiştiğinde localStorage güncellenmeli', () => {
    const columns = [{ id: '1' }];
    const tasks = [{ id: 'a' }];
    const trash = [];

    renderHook(() => useAutoSave(columns, tasks, trash));

    expect(localStorage.setItem).toHaveBeenCalledWith('kanban_columns', JSON.stringify(columns));
    expect(localStorage.setItem).toHaveBeenCalledWith('kanban_tasks', JSON.stringify(tasks));
    expect(localStorage.setItem).toHaveBeenCalledWith('kanban_trash', JSON.stringify(trash));
  });
});