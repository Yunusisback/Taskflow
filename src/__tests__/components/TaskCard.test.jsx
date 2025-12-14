import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskCard from '../../components/TaskCard';

// Mock dnd-kit
const mockUseSortable = vi.fn();
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: (args) => mockUseSortable(args),
}));

// Mock utilities
vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}));

// Mock useTaskTheme hook
vi.mock('../../hooks/useTaskTheme', () => ({
  useTaskTheme: () => ({
    ringColor: 'focus-within:ring-blue-500/50',
    scrollbarColor: '[&::-webkit-scrollbar-thumb]:bg-blue-400',
  }),
}));

describe('TaskCard Component', () => {
  const mockUpdateTask = vi.fn();
  const mockDeleteTask = vi.fn();
  const mockMoveTask = vi.fn();
  
  const task = { 
    id: 't1', 
    content: 'React Öğren', 
    columnId: 'todo',
    lastEdited: Date.now()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSortable.mockReturnValue({
      setNodeRef: vi.fn(),
      attributes: {},
      listeners: {},
      transform: null,
      transition: null,
      isDragging: false,
    });
  });

  it('görev içeriğini doğru göstermeli', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} deleteTask={mockDeleteTask} moveTask={mockMoveTask} />);
    expect(screen.getByText('React Öğren')).toBeInTheDocument();
  });

  it('tıklanınca düzenleme moduna (textarea) geçmeli', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} deleteTask={mockDeleteTask} moveTask={mockMoveTask} />);
    
    // Karta tıkla
    const card = screen.getByText('React Öğren').closest('div');
    fireEvent.click(card);

    // Textarea görünmeli
    const textarea = screen.getByDisplayValue('React Öğren');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('textarea değiştiğinde updateTask çağrılmalı', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} deleteTask={mockDeleteTask} moveTask={mockMoveTask} />);
    
    // Edit modunu aç
    fireEvent.click(screen.getByText('React Öğren'));
    
    const textarea = screen.getByDisplayValue('React Öğren');
    
    // Yazı yaz
    fireEvent.change(textarea, { target: { value: 'Yeni İçerik' } });
    
    expect(mockUpdateTask).toHaveBeenCalledWith('t1', 'Yeni İçerik');
  });

  it('Enter tuşuna basınca edit modu kapanmalı', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} deleteTask={mockDeleteTask} moveTask={mockMoveTask} />);
    
    // Edit modunu aç
    fireEvent.click(screen.getByText('React Öğren'));
    const textarea = screen.getByDisplayValue('React Öğren');

    // Enter'a bas (shift olmadan)
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    // Textarea kaybolmalı
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('karakter limiti mesajı göstermeli', () => {
    const longTask = { ...task, content: 'a'.repeat(480) }; // 500'e yakın
    render(<TaskCard task={longTask} columnTheme="blue" updateTask={mockUpdateTask} deleteTask={mockDeleteTask} moveTask={mockMoveTask} />);
    
    // Edit modunu aç
    fireEvent.click(screen.getAllByText(/a+/)[0]);
    
    // Karakter sayacı görünmeli
    expect(screen.getByText(/karakter kaldı/)).toBeInTheDocument();
  });

  it('sil butonuna basınca deleteTask çağrılmalı', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} deleteTask={mockDeleteTask} moveTask={mockMoveTask} />);
    
    // Mouse over simüle et
    const card = screen.getByText('React Öğren').closest('div');
    fireEvent.mouseEnter(card);
    
    // Sil butonunu bul ve tıkla
    const deleteButton = screen.getByTitle('Sil');
    fireEvent.click(deleteButton);
    
    expect(mockDeleteTask).toHaveBeenCalledWith('t1');
  });

  it('todo sütununda İşleniyor ve Tamamlandı butonları görünmeli', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} deleteTask={mockDeleteTask} moveTask={mockMoveTask} />);
    
    // Mouse over simüle et
    const card = screen.getByText('React Öğren').closest('div');
    fireEvent.mouseEnter(card);
    
    expect(screen.getByTitle('İşleniyor\'a taşı')).toBeInTheDocument();
    expect(screen.getByTitle('Tamamlandı\'ya taşı')).toBeInTheDocument();
  });

  it('doing/done sütunlarında İşleniyor/Tamamlandı butonları görünmemeli', () => {
    const doingTask = { ...task, columnId: 'doing' };
    render(<TaskCard task={doingTask} columnTheme="amber" updateTask={mockUpdateTask} deleteTask={mockDeleteTask} moveTask={mockMoveTask} />);
    
    // Mouse over simüle et
    const card = screen.getByText('React Öğren').closest('div');
    fireEvent.mouseEnter(card);
    
    expect(screen.queryByTitle('İşleniyor\'a taşı')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Tamamlandı\'ya taşı')).not.toBeInTheDocument();
  });
});