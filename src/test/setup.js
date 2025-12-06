import '@testing-library/jest-dom';
import { vi } from 'vitest';

// window.matchMedia fonksiyonunu mockluyoruz
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false, 
    media: query,
    onchange: null,
    addListener: vi.fn(), // eski tarayıcılar için
    removeListener: vi.fn(), // eski tarayıcılar için
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});