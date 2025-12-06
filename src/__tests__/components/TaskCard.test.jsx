import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

describe('TaskCard Component', () => {
  const mockUpdateTask = vi.fn();
  const task = { id: 't1', content: 'React Öğren', columnId: 'todo' };

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
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} />);
    expect(screen.getByText('React Öğren')).toBeInTheDocument();
  });

  it('tıklanınca düzenleme moduna (textarea) geçmeli', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} />);
    
    // Karta tıkla
    const card = screen.getByText('React Öğren').closest('div');
    fireEvent.click(card);

    // Textarea görünmeli
    const textarea = screen.getByDisplayValue('React Öğren');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('textarea değiştiğinde updateTask çağrılmalı', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} />);
    
    // Edit modunu aç
    fireEvent.click(screen.getByText('React Öğren'));
    
    const textarea = screen.getByDisplayValue('React Öğren');
    
    // Yazı yaz
    fireEvent.change(textarea, { target: { value: 'Yeni İçerik' } });
    
    expect(mockUpdateTask).toHaveBeenCalledWith('t1', 'Yeni İçerik');
  });

  it('Enter tuşuna basınca edit modu kapanmalı (veya blur olmalı)', () => {
    render(<TaskCard task={task} columnTheme="blue" updateTask={mockUpdateTask} />);
    
    // Edit modunu aç
    fireEvent.click(screen.getByText('React Öğren'));
    const textarea = screen.getByDisplayValue('React Öğren');

    // Enter'a bas
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Textarea kaybolmalı  normal div geri gelmeli
    // Not :  react state update asenkron olabilir ama test ortamında genellikle hemen yansır
    // Edit modu kapandığında textarea ekrandan kalkar
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});