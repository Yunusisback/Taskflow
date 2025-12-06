import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Trash from '../../components/Trash';

describe('Trash Component', () => {
  const mockRestore = vi.fn();
  const mockDeletePerm = vi.fn();
  const mockOnClose = vi.fn();

  const trashItems = [
    { deletedAt: 123, type: 'task', content: 'Silinen Görev' },
    { deletedAt: 456, type: 'column', title: 'Silinen Sütun' },
  ];

  it('boş olduğunda "Çöp kutusu boş" mesajını göstermeli', () => {
    render(
      <Trash 
        isOpen={true} 
        trashItems={[]} 
        onClose={mockOnClose} 
        restoreItem={mockRestore} 
        deletePermanently={mockDeletePerm} 
      />
    );
    expect(screen.getByText('Çöp kutusu boş')).toBeInTheDocument();
  });

  it('dolu olduğunda öğeleri listelemeli', () => {
    render(
      <Trash 
        isOpen={true} 
        trashItems={trashItems} 
        onClose={mockOnClose} 
        restoreItem={mockRestore} 
        deletePermanently={mockDeletePerm} 
      />
    );
    expect(screen.getByText('Silinen Görev')).toBeInTheDocument();
    expect(screen.getByText('Silinen Sütun')).toBeInTheDocument();
  });

  it('geri yükleme butonuna basınca restoreItem çalışmalı', () => {
    render(
      <Trash 
        isOpen={true} 
        trashItems={[trashItems[0]]} 
        onClose={mockOnClose} 
        restoreItem={mockRestore} 
        deletePermanently={mockDeletePerm} 
      />
    );
    
    // Geri yükle butonu (RotateCcw ikonu olan)
    const restoreBtn = screen.getByTitle('Geri Yükle');
    fireEvent.click(restoreBtn);
    expect(mockRestore).toHaveBeenCalledWith(trashItems[0]);
  });

  it('kapatma butonuna basınca onClose çalışmalı', () => {
    render(
      <Trash 
        isOpen={true} 
        trashItems={[]} 
        onClose={mockOnClose} 
        restoreItem={mockRestore} 
        deletePermanently={mockDeletePerm} 
      />
    );
    // X ikonlu buton
    const closeButtons = screen.getAllByRole('button');
    
    // Genellikle ilk buton X butonudur (başlıkta)
    fireEvent.click(closeButtons[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });
});