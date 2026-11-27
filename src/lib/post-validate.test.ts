import { describe, expect, it } from 'vitest';
import { toPostInput, today, validatePost, type PostInput } from './post-validate';

const validInput: PostInput = {
  title: 'Mất tai nghe không dây',
  kind: 'Thất lạc',
  category: 'Khác',
  place: 'Thư viện',
  date: '2026-11-10',
  description: 'Mình làm rơi tai nghe, ai nhặt được xin liên hệ giúp.',
  contactType: 'Zalo',
  contact: '0912345678',
};

describe('toPostInput', () => {
  it('điền chuỗi rỗng cho trường thiếu và mặc định loại liên hệ là Zalo', () => {
    expect(toPostInput({ title: 'Mất thẻ' })).toEqual({
      title: 'Mất thẻ',
      kind: '',
      category: '',
      place: '',
      date: '',
      description: '',
      contactType: 'Zalo',
      contact: '',
    });
  });

  it('đọc giá trị từ FormData', () => {
    const formData = new FormData();
    formData.set('contactType', 'Email');
    formData.set('contact', 'sv@ptit.edu.vn');
    expect(toPostInput(formData).contactType).toBe('Email');
    expect(toPostInput(formData).contact).toBe('sv@ptit.edu.vn');
  });
});

describe('validatePost', () => {
  it('trả object lỗi rỗng khi tin hợp lệ', () => {
    expect(validatePost(validInput)).toEqual({});
  });

  it('báo đủ lỗi khi form để trống', () => {
    expect(validatePost(toPostInput({}))).toEqual({
      title: 'Tiêu đề tối thiểu 5 ký tự',
      kind: 'Hãy chọn loại tin',
      category: 'Hãy chọn danh mục',
      place: 'Hãy chọn địa điểm',
      date: 'Hãy chọn ngày',
      description: 'Mô tả tối thiểu 20 ký tự',
      contact: 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0',
    });
  });

  it('từ chối ngày trong tương lai', () => {
    const future = new Date(`${today()}T00:00:00.000Z`);
    future.setUTCDate(future.getUTCDate() + 1);
    const futureDate = future.toISOString().slice(0, 10);
    expect(validatePost({ ...validInput, date: futureDate }).date).toBe('Ngày không được ở tương lai');
  });

  it('kiểm tra tiêu đề tối thiểu sau trim', () => {
    expect(validatePost({ ...validInput, title: '  ab  ' }).title).toBe('Tiêu đề tối thiểu 5 ký tự');
  });

  it('từ chối tiêu đề dài hơn 80 ký tự', () => {
    expect(validatePost({ ...validInput, title: 'a'.repeat(81) }).title).toBe('Tiêu đề tối đa 80 ký tự');
  });

  it('từ chối loại tin không tồn tại', () => {
    expect(validatePost({ ...validInput, kind: 'Thất lạc tài sản' }).kind).toBe('Hãy chọn loại tin');
  });

  it('báo lỗi khi email liên hệ sai định dạng', () => {
    expect(validatePost({ ...validInput, contactType: 'Email', contact: 'abc' }).contact).toBe('Email không hợp lệ');
  });

  it('chấp nhận email liên hệ đúng định dạng', () => {
    expect(validatePost({ ...validInput, contactType: 'Email', contact: 'sv@ptit.edu.vn' })).toEqual({});
  });

  it('báo lỗi khi số điện thoại thiếu chữ số', () => {
    expect(validatePost({ ...validInput, contactType: 'SĐT', contact: '091234567' }).contact)
      .toBe('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0');
  });

  it('báo lỗi khi loại liên hệ không được hỗ trợ', () => {
    expect(validatePost({ ...validInput, contactType: 'Telegram' }).contactType).toBe('Hãy chọn loại liên hệ');
  });
});
