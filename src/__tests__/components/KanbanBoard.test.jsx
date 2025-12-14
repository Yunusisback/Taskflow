import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanbanBoard from '../../components/KanbanBoard';

// useKanbanData hook'unun fonksiyonlarını ve verilerini mockluyoruz
const mockCreateNewColumn = vi.fn();
const mockSetColumns = vi.fn();
const mockSetTasks = vi.fn();

const mockData = {
  columns: [{ id: 'col1', title: 'Test Sütun', color: 'blue' }],
  setColumns: mockSetColumns,
  tasks: [],
  setTasks: mockSetTasks,
  trash: [],
  createNewColumn: mockCreateNewColumn,
  createTask: vi.fn(),
  updateColumn: vi.fn(),
  deleteColumn: vi.fn(),
  deleteTask: vi.fn(),
  updateTask: vi.fn(),
  moveTask: vi.fn(),
  restoreItem: vi.fn(),
  deletePermanently: vi.fn(),
};

vi.mock('../../hooks/useKanbanData', () => ({
  useKanbanData: () => mockData,
}));

// useScrollNavigation mock
vi.mock('../../hooks/useScrollNavigation', () => ({
  useScrollNavigation: () => ({
    scrollRef: { current: null },
    itemsRef: { current: [] },
    activeColumnIndex: 0,
    navigateToColumn: vi.fn(),
  }),
}));

// useEdgeScroll mock
vi.mock('../../hooks/useEdgeScroll', () => ({
  useEdgeScroll: () => ({ handleEdgeScroll: vi.fn() }),
}));

vi.mock('../../components/ColumnContainer', () => ({
  default: ({ column }) => <div data-testid="column">{column.title}</div>,
}));

vi.mock('../../components/TrashDropZone', () => ({
  default: ({ onClick, count }) => <button onClick={onClick}>TrashZone ({count})</button>,
}));

vi.mock('../../components/Trash', () => ({
  default: () => <div>TrashPanel</div>,
}));

vi.mock('../../components/ConfirmModal', () => ({
  default: () => <div>ConfirmModal</div>,
}));

vi.mock('../../components/FloatingNav', () => ({
  default: () => <div>FloatingNav</div>,
}));

// dnd-kit için basit mocklar
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual,
    DndContext: ({ children }) => <div>{children}</div>,
    DragOverlay: () => null,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
    PointerSensor: vi.fn(),
    closestCorners: vi.fn(),
    MeasuringStrategy: { Always: 'always' },
  };
});

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }) => <div>{children}</div>,
  arrayMove: vi.fn((arr, from, to) => arr),
}));

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

  it('dark mode aktifken Aydınlık Mod başlığı göstermeli', () => {
    render(<KanbanBoard darkMode={true} toggleTheme={() => {}} />);
    
    const themeBtn = screen.getByTitle('Aydınlık Mod');
    expect(themeBtn).toBeInTheDocument();
  });

  it('yeni liste ekle butonuna basınca createNewColumn çalışmalı', () => {
    render(<KanbanBoard darkMode={false} toggleTheme={() => {}} />);

    const addButton = screen.getByText('Yeni Liste Ekle'); 
    fireEvent.click(addButton);

    expect(mockCreateNewColumn).toHaveBeenCalled();
  });

  it('yedekle butonunu render etmeli', () => {
    render(<KanbanBoard darkMode={false} toggleTheme={() => {}} />);
    
    const downloadBtn = screen.getByText('Yedekle');
    expect(downloadBtn).toBeInTheDocument();
  });

  it('TrashDropZone çöp sayısını göstermeli', () => {
    const mockDataWithTrash = {
      ...mockData,
      trash: [{ id: 1 }, { id: 2 }],
    };
    
    vi.mocked(require('../../hooks/useKanbanData').useKanbanData).mockReturnValueOnce(mockDataWithTrash);
    
    render(<KanbanBoard darkMode={false} toggleTheme={() => {}} />);
    
    expect(screen.getByText(/TrashZone/)).toBeInTheDocument();
  });

  it('FloatingNav bileşenini render etmeli', () => {
    render(<KanbanBoard darkMode={false} toggleTheme={() => {}} />);
    
    expect(screen.getByText('FloatingNav')).toBeInTheDocument();
  });
});