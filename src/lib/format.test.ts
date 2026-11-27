import { describe, expect, it } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('định dạng ngày ISO thành ngày/tháng/năm', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
  });
});
