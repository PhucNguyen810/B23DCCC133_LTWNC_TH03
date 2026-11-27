import { describe, expect, it } from 'vitest';
import { can } from './permissions';

describe('can', () => {
  it('cho phép khách chỉ xem tin', () => {
    expect(can(undefined, 'post:view')).toBe(true);
    expect(can(undefined, 'post:create')).toBe(false);
    expect(can(undefined, 'post:resolve')).toBe(false);
    expect(can(undefined, 'post:moderate')).toBe(false);
  });

  it('cho phép member đăng và nhận lại tin nhưng không kiểm duyệt', () => {
    expect(can('member', 'post:view')).toBe(true);
    expect(can('member', 'post:create')).toBe(true);
    expect(can('member', 'post:resolve')).toBe(true);
    expect(can('member', 'post:moderate')).toBe(false);
  });

  it('cho phép admin kiểm duyệt nhưng không đăng hoặc nhận lại tin', () => {
    expect(can('admin', 'post:view')).toBe(true);
    expect(can('admin', 'post:create')).toBe(false);
    expect(can('admin', 'post:resolve')).toBe(false);
    expect(can('admin', 'post:moderate')).toBe(true);
  });
});
