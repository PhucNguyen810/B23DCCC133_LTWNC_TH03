import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PostForm, { type PostFormAction } from './PostForm';
import type { PostFormState } from '@/lib/post-validate';

describe('PostForm', () => {
  it('renders every labeled field and provides the Zalo default', () => {
    const action: PostFormAction = vi.fn(async () => ({ errors: {}, values: {} }));
    render(<PostForm action={action} />);

    for (const label of ['Tiêu đề', 'Loại tin', 'Danh mục', 'Địa điểm', 'Ngày', 'Mô tả', 'Loại liên hệ', 'Thông tin liên hệ']) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByLabelText('Loại liên hệ')).toHaveValue('Zalo');
  });

  it('keeps entered values and displays returned field errors', async () => {
    const returnedState: PostFormState = {
      errors: { contact: 'Email không hợp lệ' },
      values: {
        title: 'Mất tai nghe',
        kind: 'Thất lạc',
        category: 'Khác',
        place: 'Thư viện',
        date: '2026-11-10',
        description: 'Mô tả đủ dài để hợp lệ.',
        contactType: 'Email',
        contact: 'abc',
      },
    };
    const action: PostFormAction = vi.fn(async () => returnedState);
    const user = userEvent.setup();
    render(<PostForm action={action} />);

    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email không hợp lệ');
    await waitFor(() => {
      expect(screen.getByLabelText('Tiêu đề')).toHaveValue('Mất tai nghe');
      expect(screen.getByLabelText('Loại liên hệ')).toHaveValue('Email');
      expect(screen.getByLabelText('Thông tin liên hệ')).toHaveValue('abc');
    });
  });
});
