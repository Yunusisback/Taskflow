import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// KanbanBoard bileşenini mockluyoruz
vi.mock('../components/KanbanBoard', () => ({
  default: ({ darkMode }) => <div>Board: {darkMode ? 'Dark' : 'Light'}</div>,
}));

describe('App Component', () => {
  it('uygulamayı render etmeli', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('Localstorage dark modu okuyup class atamalı', () => {
    // localStorage a dark mode kaydedelim
    localStorage.setItem('theme', 'dark');
    
    const { container } = render(<App />);
    
    // div'in class'ında dark olmalı
    expect(container.firstChild).toHaveClass('dark');
  });
});