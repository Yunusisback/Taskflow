import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanbanBoard from '../../components/KanbanBoard';

// useKanbanData hook unun fonksiyonlarını ve verilerini mockluyoruz
const mockCreateNewColumn = vi.fn();
const mockData = {
  columns: [{ id: 'col1', title: 'Test Sütun' }],
  tasks: [],
  trash: [],
  createNewColumn: mockCreateNewColumn,
  createTask: vi.fn(),
  updateColumn: vi.fn(),
  deleteColumn: vi.fn(),
  deleteTask: vi.fn(),
  updateTask: vi.fn(),
  restoreItem: vi.fn(),
  deletePermanently: vi.fn(),
};

vi.mock('../../hooks/useKanbanData', () => ({
  useKanbanData: () => mockData,
}));


vi.mock('../../components/ColumnContainer', () => ({

  default: ({ column }) => <div data-testid="column">{column.title}</div>,
}));

vi.mock('../../components/TrashDropZone', () => ({
  default: () => <button>TrashZone</button>,
}));

vi.mock('../../components/Trash', () => ({
  default: () => <div>TrashPanel</div>,
}));

// dnd-kit için basit mocklar
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual,
    DndContext: ({ children }) => <div>{children}</div>,
    DragOverlay: () => null,
  };
});
// KanbanBoard bileşen testi
describe('KanbanBoard Component', () => {
  it('başlığı ve sütunları render etmeli', () => {
    render(<KanbanBoard darkMode={false} toggleTheme={() => {}} />);
    
    expect(screen.getByText('Taskflow')).toBeInTheDocument();
    
    
    expect(screen.getByTestId('column')).toHaveTextContent('Test Sütun');
  });

  // Tema değiştirme butonunun çalıştığını test et
  it('tema değiştirme butonuna basınca fonksiyon çalışmalı', () => {
    const mockToggle = vi.fn();
    render(<KanbanBoard darkMode={false} toggleTheme={mockToggle} />);
    
    // Güneş - Ay ikonu olan butonu bul (title ile)
    const themeBtn = screen.getByTitle('Karanlık Mod');
    fireEvent.click(themeBtn);
    
    expect(mockToggle).toHaveBeenCalled();
  });

  it('yeni liste ekle butonuna basınca createNewColumn çalışmalı', () => {
    render(<KanbanBoard darkMode={false} toggleTheme={() => {}} />);

    //  Butonun tam metni 'Yeni Liste Ekle'
    const addButton = screen.getByText('Yeni Liste Ekle'); 
    fireEvent.click(addButton);

    expect(mockCreateNewColumn).toHaveBeenCalled();
  });
});