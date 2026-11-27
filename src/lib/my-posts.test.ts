import { afterEach, describe, expect, it } from 'vitest';
import { db } from './db';
import { listMine, parseStatus, resolvePost, submitPost } from './my-posts';
import type { PostInput } from './post-validate';

const originalPosts = db.posts.map((post) => ({ ...post }));
const originalNextPostId = db.nextPostId;

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

describe('my-posts', () => {
  it('sv01 có 27 tin', () => {
    expect(listMine('sv01@ptit.edu.vn', '').total).toBe(27);
  });

  it('trang đầu có 8 tin và nextCursor bằng 8', () => {
    const result = listMine('sv01@ptit.edu.vn', '', 0, 8);
    expect(result.items).toHaveLength(8);
    expect(result.nextCursor).toBe(8);
  });

  it('trang cuối bắt đầu ở cursor 24 có 3 tin và không còn cursor tiếp', () => {
    const result = listMine('sv01@ptit.edu.vn', '', 24, 8);
    expect(result.items).toHaveLength(3);
    expect(result.nextCursor).toBeNull();
  });

  it('lọc pending của sv01 còn 3 tin', () => {
    const result = listMine('sv01@ptit.edu.vn', parseStatus('pending'));
    expect(result.total).toBe(3);
    expect(result.items.every((post) => post.status === 'pending')).toBe(true);
  });

  it('sv02 chỉ có 9 tin của mình', () => {
    expect(listMine('sv02@ptit.edu.vn', '').total).toBe(9);
  });

  it('parseStatus bỏ qua giá trị không hợp lệ', () => {
    expect(parseStatus('approved')).toBe('approved');
    expect(parseStatus('invalid')).toBe('');
  });

  it('submitPost thêm tin pending vào đầu mảng và ghép thông tin liên hệ', () => {
    const post = submitPost('sv01@ptit.edu.vn', validInput);
    expect(db.posts[0]).toBe(post);
    expect(post.id).toBe(37);
    expect(post.status).toBe('pending');
    expect(post.resolved).toBe(false);
    expect(post.description).toContain('\nLiên hệ: Zalo 0912345678');
  });

  it('resolvePost trả đúng các kết quả và chỉ nhận lại tin approved của chủ tin', () => {
    expect(resolvePost('sv01@ptit.edu.vn', 999)).toBe('not-found');
    expect(resolvePost('sv02@ptit.edu.vn', 2)).toBe('forbidden');
    expect(resolvePost('sv02@ptit.edu.vn', 5)).toBe('not-approved');
    expect(resolvePost('sv01@ptit.edu.vn', 2)).toBe('ok');
    expect(db.posts.find((post) => post.id === 2)?.resolved).toBe(true);
  });
});

afterEach(() => {
  db.posts.splice(0, db.posts.length, ...originalPosts.map((post) => ({ ...post })));
  db.nextPostId = originalNextPostId;
});
