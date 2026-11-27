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
  it('fills absent fields with empty strings and defaults an absent contact type to Zalo', () => {
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

  it('reads values from FormData', () => {
    const formData = new FormData();
    formData.set('contactType', 'Email');
    formData.set('contact', 'sv@ptit.edu.vn');
    expect(toPostInput(formData).contactType).toBe('Email');
    expect(toPostInput(formData).contact).toBe('sv@ptit.edu.vn');
  });
});

describe('validatePost', () => {
  it('returns no field errors for valid input', () => {
    expect(validatePost(validInput)).toEqual({});
  });

  it('reports the required errors for a blank form', () => {
    const errors = validatePost(toPostInput({}));
    expect(errors).toEqual({
      title: 'Tiêu đề tối thiểu 5 ký tự',
      kind: 'Hãy chọn loại tin',
      category: 'Hãy chọn danh mục',
      place: 'Hãy chọn địa điểm',
      date: 'Hãy chọn ngày',
      description: 'Mô tả tối thiểu 20 ký tự',
      contact: 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0',
    });
  });

  it('validates title limits, future dates, and contact format', () => {
    const future = new Date(`${today()}T00:00:00.000Z`);
    future.setUTCDate(future.getUTCDate() + 1);
    const futureDate = future.toISOString().slice(0, 10);
    expect(validatePost({ ...validInput, title: 'a'.repeat(81) }).title).toBe('Tiêu đề tối đa 80 ký tự');
    expect(validatePost({ ...validInput, date: futureDate }).date).toBe('Ngày không được ở tương lai');
    expect(validatePost({ ...validInput, contactType: 'Email', contact: 'abc' }).contact).toBe('Email không hợp lệ');
    expect(validatePost({ ...validInput, contactType: 'Other' }).contactType).toBe('Hãy chọn loại liên hệ');
  });
});
