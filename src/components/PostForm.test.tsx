import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PostForm from './PostForm';

vi.mock('@/app/(member)/my-posts/actions', () => ({
  createPostAction: vi.fn(async () => ({ message: '', errors: [], success: false })),
}));

describe('PostForm', () => {
  it('renders labeled fields and submits through an action form', () => {
    const { container } = render(<PostForm />);
    expect(screen.getByLabelText('Tiêu đề')).toBeInTheDocument();
    expect(screen.getByLabelText('Loại tin')).toBeInTheDocument();
    expect(screen.getByLabelText('Danh mục')).toBeInTheDocument();
    expect(screen.getByLabelText('Địa điểm')).toBeInTheDocument();
    expect(screen.getByLabelText('Ngày')).toBeInTheDocument();
    expect(screen.getByLabelText('Mô tả')).toBeInTheDocument();
    expect(container.querySelector('form')?.getAttribute('action')).toBeDefined();
  });
});
