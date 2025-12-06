import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TrashDropZone from '../../components/TrashDropZone';

// Mock dnd-kit useDroppable
const mockSetNodeRef = vi.fn();

// Varsayılan olarak isOver  false dönecek şekilde ayarlıyoruz
let mockIsOver = false;

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: mockSetNodeRef,
    isOver: mockIsOver,
  }),
}));

describe('TrashDropZone Component', () => {
  it('normal durumda doğru render edilmeli', () => {
    mockIsOver = false;
    render(<TrashDropZone count={0} onClick={() => {}} />);
    
   // Buton ve ikon render edilmeli
    const button = screen.getByTitle('Çöp Kutusu (Sürükleyip Bırakabilirsiniz)');
    expect(button).toBeInTheDocument();

    // Normal renkler (class kontrolü yapmak zor olabilir ama text kontrolü yapabiliriz)
    expect(screen.queryByText('Silmek için bırak')).not.toBeInTheDocument();
  });

  it('üzerine sürüklenince (isOver) "Silmek için bırak" yazısı çıkmalı', () => {
    mockIsOver = true; 
    render(<TrashDropZone count={0} onClick={() => {}} />);
    
    expect(screen.getByText('Silmek için bırak')).toBeInTheDocument();
  });

  it('sayı (count) > 0 ise badge göstermeli', () => {
    mockIsOver = false;
    render(<TrashDropZone count={5} onClick={() => {}} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('tıklanınca onClick çalışmalı', () => {
    const handleClick = vi.fn();
    render(<TrashDropZone count={0} onClick={handleClick} />);
    
    const button = screen.getByTitle('Çöp Kutusu (Sürükleyip Bırakabilirsiniz)');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});