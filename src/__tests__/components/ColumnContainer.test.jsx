import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ColumnContainer from '../../components/ColumnContainer';


// dnd-kit hook'larını mockluyoruz çünkü bu unit testte sürükle-bırak motorunu test etmiyoruz
const mockUseSortable = vi.fn();
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: (args) => mockUseSortable(args),
  SortableContext: ({ children }) => <div data-testid="sortable-context">{children}</div>,
  verticalListSortingStrategy: {},
}));

// TaskCard'ı mock'luyoruz böylece sadece ColumnContainer'a odaklanıyoruz
vi.mock('../../components/TaskCard', () => ({
  default: ({ task }) => <div data-testid="task-card">{task.content}</div>,
}));

// dnd-kit utilities mock
vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}));

describe('ColumnContainer Component', () => {
  // Ortak mock fonksiyonlar
  const mockDeleteColumn = vi.fn();
  const mockUpdateColumn = vi.fn();
  const mockCreateTask = vi.fn();
  const mockUpdateTask = vi.fn();

  // Varsayılan props
  const defaultProps = {
    column: { id: 'col1', title: 'Test Sütunu' },
    tasks: [
      { id: 't1', content: 'Görev 1', columnId: 'col1' },
      { id: 't2', content: 'Görev 2', columnId: 'col1' },
    ],
    deleteColumn: mockDeleteColumn,
    updateColumn: mockUpdateColumn,
    createTask: mockCreateTask,
    updateTask: mockUpdateTask,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // useSortable varsayılan dönüş değeri (sürüklenmiyor durumu)
    mockUseSortable.mockReturnValue({
      setNodeRef: vi.fn(),
      attributes: {},
      listeners: {},
      transform: null,
      transition: null,
      isDragging: false,
    });
  });

  it('başlığı ve görev sayısını doğru render etmeli', () => {
    render(<ColumnContainer {...defaultProps} />);

    // Başlık kontrolü
    expect(screen.getByText('Test Sütunu')).toBeInTheDocument();

    // Görev sayısı (badge) kontrolü
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('görevleri (TaskCard) listelemeli', () => {
    render(<ColumnContainer {...defaultProps} />);
    
    // Mockladığımız TaskCard'ların render edilip edilmediğini kontrol et
    const tasks = screen.getAllByTestId('task-card');
    expect(tasks).toHaveLength(2);
    expect(screen.getByText('Görev 1')).toBeInTheDocument();
  });

  it('boş olduğunda "Henüz görev yok" mesajını göstermeli', () => {
    render(<ColumnContainer {...defaultProps} tasks={[]} />);

    expect(screen.getByText('Henüz görev yok')).toBeInTheDocument();
    expect(screen.queryByTestId('task-card')).not.toBeInTheDocument();
  });

  it('yeni görev ekle butonuna basınca createTask fonksiyonunu çağırmalı', () => {
    render(<ColumnContainer {...defaultProps} />);

    const addButton = screen.getByText('Yeni görev ekle');
    fireEvent.click(addButton);

    expect(mockCreateTask).toHaveBeenCalledTimes(1);
    expect(mockCreateTask).toHaveBeenCalledWith('col1');
  });

  it('varsayılan sütunlarda (todo, doing, done) silme butonu GÖSTERMEMELİ', () => {
    const todoProps = { ...defaultProps, column: { id: 'todo', title: 'Yapılacaklar' } };
    render(<ColumnContainer {...todoProps} />);

    
    // Edit butonu vardır
    const buttons = screen.getAllByRole('button');

    // 1  Edit 2  Yeni Görev Ekle. Toplam 2 buton olmalı (Silme yok)
    expect(buttons.length).toBe(2); 
  });

  it('özel sütunlarda silme butonuna basınca deleteColumn fonksiyonunu çağırmalı', () => {
    render(<ColumnContainer {...defaultProps} />); // id="col1" (özel sütun)

   // Silme butonuna tıkla
    const buttons = screen.getAllByRole('button');

  // Buton sıralaması: [0: Edit, 1: Delete, 2: Yeni Görev Ekle]
    const deleteButton = buttons[1]; 
    
    fireEvent.click(deleteButton);
    expect(mockDeleteColumn).toHaveBeenCalledWith('col1');
  });

  it('başlık düzenleme modunu açıp kaydedebilmeli', () => {
    render(<ColumnContainer {...defaultProps} />);

    // Düzenle butonuna tıkla
    const editButton = screen.getAllByRole('button')[0]; // İlk buton edit
    fireEvent.click(editButton);

    // Input alanı gelmeli
    const input = screen.getByDisplayValue('Test Sütunu');
    expect(input).toBeInTheDocument();

    // Yeni değer yaz
    fireEvent.change(input, { target: { value: 'Yeni Başlık' } });

    // Blur (odaktan çıkma) ile kaydet
    fireEvent.blur(input);

    expect(mockUpdateColumn).toHaveBeenCalledWith('col1', 'Yeni Başlık');
  });

  it('sürüklenme (dragging) esnasında farklı bir görünüm render etmeli', () => {
    // useSortable mock'unu bu test için özel olarak override ediyoruz
    mockUseSortable.mockReturnValue({
      setNodeRef: vi.fn(),
      attributes: {},
      listeners: {},
      transform: null,
      transition: null,
      isDragging: true, // sürükleniyor
    });

    const { container } = render(<ColumnContainer {...defaultProps} />);

   
    // Sürüklenme sırasında render edilen placeholder kontrolü
    const dragPlaceholder = container.firstChild;
    expect(dragPlaceholder).toHaveClass('opacity-50');
    expect(dragPlaceholder).toHaveClass('border-dashed');
    expect(screen.queryByText('Test Sütunu')).not.toBeInTheDocument();
  });
});