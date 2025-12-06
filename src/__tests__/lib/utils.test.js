import { describe, it, expect } from 'vitest';
import { cn } from '../../lib/utils';

describe('utils library', () => {
  it('cn fonksiyonu sınıfları birleştirmeli', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('conditional sınıfları doğru işlemeli', () => {
    const result = cn('class1', false && 'class2', true && 'class3');
    expect(result).toBe('class1 class3');
  });

  it('tailwind sınıflarını merge etmeli (çakışmaları çözmeli)', () => {
   
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
  });
});