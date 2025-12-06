import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmModal from '../../components/ConfirmModal';

describe('ConfirmModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Silinsin mi?',
    message: 'Bu işlem geri alınamaz.',
  };

  it('isOpen false olduğunda hiçbir şey render etmemeli', () => {
    const { container } = render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('isOpen true olduğunda başlık ve mesajı göstermeli', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Silinsin mi?')).toBeInTheDocument();
    expect(screen.getByText('Bu işlem geri alınamaz.')).toBeInTheDocument();
  });

  it('İptal butonuna basınca onClose çalışmalı', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('İptal'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('Evet, Sil butonuna basınca onConfirm çalışmalı', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Evet, Sil'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});