import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColumnColorPicker from '../../components/ColumnColorPicker';

// Mock colorpalette
vi.mock('../../constants/columnColors', () => ({
  colorPalette: [
    { id: 'blue', name: 'Mavi', bg: 'bg-blue-500' },
    { id: 'amber', name: 'Turuncu', bg: 'bg-amber-500' },
    { id: 'emerald', name: 'Yeşil', bg: 'bg-emerald-500' },
  ],
}));

describe('ColumnColorPicker Component', () => {
  const mockOnColorChange = vi.fn();

  it('show=false olduğunda hiçbir şey render etmemeli', () => {
    const { container } = render(
      <ColumnColorPicker 
        show={false} 
        currentColor="blue" 
        onColorChange={mockOnColorChange} 
      />
    );
    
    expect(container).toBeEmptyDOMElement();
  });

  it('show=true olduğunda renk paletini göstermeli', () => {
    render(
      <ColumnColorPicker 
        show={true} 
        currentColor="blue" 
        onColorChange={mockOnColorChange} 
      />
    );
    
    // 3 renk butonu olmalı 
    const colorButtons = screen.getAllByRole('button');
    expect(colorButtons).toHaveLength(3);
  });

  it('mevcut renk seçili görünmeli', () => {
    render(
      <ColumnColorPicker 
        show={true} 
        currentColor="blue" 
        onColorChange={mockOnColorChange} 
      />
    );
    
    const blueButton = screen.getByTitle('Mavi');
    
    // Seçili renkte check mark (svg) olmalı
    const svg = blueButton.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renk butonuna tıklandığında onColorChange çağrılmalı', () => {
    render(
      <ColumnColorPicker 
        show={true} 
        currentColor="blue" 
        onColorChange={mockOnColorChange} 
      />
    );
    
    const amberButton = screen.getByTitle('Turuncu');
    fireEvent.click(amberButton);
    
    expect(mockOnColorChange).toHaveBeenCalledWith('amber');
  });

  it('tüm renk butonlarının title attribute olmalı', () => {
    render(
      <ColumnColorPicker 
        show={true} 
        currentColor="blue" 
        onColorChange={mockOnColorChange} 
      />
    );
    
    expect(screen.getByTitle('Mavi')).toBeInTheDocument();
    expect(screen.getByTitle('Turuncu')).toBeInTheDocument();
    expect(screen.getByTitle('Yeşil')).toBeInTheDocument();
  });
});