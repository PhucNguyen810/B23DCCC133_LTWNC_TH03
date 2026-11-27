import { describe, expect, it } from 'vitest';
import { validatePost } from './post-validate';

const validInput = {
  title: '  Mất thẻ sinh viên  ',
  kind: 'Thất lạc',
  category: 'Thẻ sinh viên',
  place: 'Tòa A2',
  date: '2026-11-27',
  description: '  Tìm giúp mình.  ',
};

describe('validatePost', () => {
  it('trims text and returns a typed post for valid input', () => {
    const result = validatePost(validInput);
    expect(result).toEqual({
      ok: true,
      value: {
        ...validInput,
        title: 'Mất thẻ sinh viên',
        description: 'Tìm giúp mình.',
      },
    });
  });

  it('rejects invalid enum fields and impossible dates', () => {
    const result = validatePost({ ...validInput, kind: 'unknown', category: '', place: 'Ngoài trường', date: '2026-02-31' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('Loại tin không hợp lệ');
      expect(result.errors).toContain('Danh mục không hợp lệ');
      expect(result.errors).toContain('Địa điểm không hợp lệ');
      expect(result.errors).toContain('Ngày không hợp lệ');
    }
  });
});
