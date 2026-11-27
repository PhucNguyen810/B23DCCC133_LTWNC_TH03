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

describe('my-posts services', () => {
  it('lists only the owner’s posts with status and cursor pagination', () => {
    const first = listMine('sv01@ptit.edu.vn', '', 0, 8);
    expect(first.items).toHaveLength(8);
    expect(first.total).toBe(27);
    expect(first.nextCursor).toBe(8);

    const pending = listMine('sv01@ptit.edu.vn', parseStatus('pending'));
    expect(pending.total).toBe(3);
    expect(pending.nextCursor).toBeNull();

    expect(listMine('sv02@ptit.edu.vn', '', 0, 8).total).toBe(9);
    expect(parseStatus('other')).toBe('');
  });

  it('submits new pending posts to the front with contact details in description', () => {
    const post = submitPost('sv01@ptit.edu.vn', validInput);
    expect(db.posts[0]).toBe(post);
    expect(post.id).toBe(37);
    expect(post.status).toBe('pending');
    expect(post.resolved).toBe(false);
    expect(post.description).toContain('\nLiên hệ: Zalo 0912345678');
  });

  it('returns each resolve outcome and resolves only an approved owner post', () => {
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
