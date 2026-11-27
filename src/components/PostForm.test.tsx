import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PostForm, { type PostFormAction } from './PostForm';
import type { PostFormState } from '@/lib/post-validate';

const createAction = (result: PostFormState) => vi.fn(async (
  previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> => {
  void previousState;
  void formData;
  return result;
});

describe('Biểu mẫu đăng tin', () => {
  it('hiện lỗi ngay dưới đúng trường được trả về từ action', async () => {
    const action = createAction({
      errors: {
        title: 'Tiêu đề tối thiểu 5 ký tự',
        kind: 'Hãy chọn loại tin',
        category: 'Hãy chọn danh mục',
        place: 'Hãy chọn địa điểm',
        date: 'Hãy chọn ngày',
        description: 'Mô tả tối thiểu 20 ký tự',
        contact: 'Email không hợp lệ',
      },
      values: {},
    });
    const user = userEvent.setup();
    render(<PostForm action={action} />);

    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));
    const contact = screen.getByLabelText('Thông tin liên hệ');
    expect(await screen.findByText('Email không hợp lệ')).toHaveAttribute('role', 'alert');
    expect(contact).toHaveAttribute('aria-describedby', 'contact-error');
    expect(screen.getAllByRole('alert')).toHaveLength(7);
  });

  it('gửi các giá trị đã nhập bằng userEvent qua FormData', async () => {
    const action = createAction({ errors: {}, values: {}, message: 'Đã gửi tin', ok: true });
    const user = userEvent.setup();
    render(<PostForm action={action} />);

    await user.type(screen.getByLabelText('Tiêu đề'), 'Mất tai nghe không dây');
    await user.selectOptions(screen.getByLabelText('Loại tin'), 'Thất lạc');
    await user.selectOptions(screen.getByLabelText('Danh mục'), 'Khác');
    await user.selectOptions(screen.getByLabelText('Địa điểm'), 'Thư viện');
    await user.type(screen.getByLabelText('Ngày'), '2020-01-01');
    await user.type(screen.getByLabelText('Mô tả'), 'Mình làm rơi tai nghe, xin liên hệ giúp.');
    await user.selectOptions(screen.getByLabelText('Loại liên hệ'), 'Email');
    await user.type(screen.getByLabelText('Thông tin liên hệ'), 'sv@ptit.edu.vn');
    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const submitted = action.mock.calls[0][1];
    expect(submitted).toBeInstanceOf(FormData);
    expect(submitted.get('kind')).toBe('Thất lạc');
    expect(submitted.get('contactType')).toBe('Email');
    expect(submitted.get('contact')).toBe('sv@ptit.edu.vn');
  });

  it('hiện thông báo không có quyền và giữ lại tiêu đề đã nhập', async () => {
    const action = createAction({
      errors: {},
      values: { title: 'Mất tai nghe không dây', contactType: 'Email', contact: 'sv@ptit.edu.vn' },
      message: 'Không có quyền',
    });
    const user = userEvent.setup();
    render(<PostForm action={action} />);

    await user.type(screen.getByLabelText('Tiêu đề'), 'Mất tai nghe không dây');
    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Không có quyền');
    expect(screen.getByLabelText('Tiêu đề')).toHaveValue('Mất tai nghe không dây');
    expect(screen.getByLabelText('Loại liên hệ')).toHaveValue('Email');
    expect(screen.getByLabelText('Thông tin liên hệ')).toHaveValue('sv@ptit.edu.vn');
  });

  it('mặc định loại liên hệ là Zalo', () => {
    const action: PostFormAction = async () => ({ errors: {}, values: {} });
    render(<PostForm action={action} />);
    expect(screen.getByLabelText('Loại liên hệ')).toHaveValue('Zalo');
  });
});
