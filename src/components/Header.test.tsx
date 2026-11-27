import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

const sessionState = vi.hoisted(() => ({
  data: { user: { name: 'Nguyễn Văn An', role: 'member' } as { name: string; role: 'member' | 'admin' } },
  status: 'authenticated',
}));

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
  useSession: () => sessionState,
}));

describe('Thanh điều hướng', () => {
  it('hiện lời chào member và ẩn liên kết quản trị', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Tin đăng' })).toHaveAttribute('href', '/posts');
    expect(screen.getByRole('link', { name: 'Tin của tôi' })).toHaveAttribute('href', '/my-posts');
    expect(screen.getByText('Xin chào, Nguyễn Văn An (member)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Đăng xuất' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Quản trị' })).not.toBeInTheDocument();
  });

  it('chỉ hiện liên kết quản trị cho admin', () => {
    sessionState.data = { user: { name: 'Quản trị Chợ', role: 'admin' } };
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Quản trị' })).toHaveAttribute('href', '/admin');
    expect(screen.getByText('Xin chào, Quản trị Chợ (admin)')).toBeInTheDocument();
  });
});
