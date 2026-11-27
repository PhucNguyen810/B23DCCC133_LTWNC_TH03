import { afterEach, describe, expect, it } from 'vitest';
import { db } from './db';
import { createMyPost, getMyPosts, resolveMyPost } from './my-posts';

describe('my-posts services', () => {
  it('filters a member’s posts and returns only the requested page', () => {
    expect(getMyPosts('sv01@ptit.edu.vn').total).toBe(27);
    const page = getMyPosts('sv01@ptit.edu.vn', { q: 'điện thoại', page: 1, pageSize: 1 });
    expect(page.posts).toHaveLength(1);
    expect(page.posts[0].title.toLocaleLowerCase('vi')).toContain('điện thoại');
    expect(page.hasMore).toBe(true);
  });

  it('creates pending posts and allows only the author to resolve them', () => {
    const result = createMyPost({
      title: 'Mất chìa khóa',
      kind: 'Thất lạc',
      category: 'Chìa khóa',
      place: 'Tòa A2',
      date: '2026-11-27',
      description: 'Gần cổng trường.',
    }, 'sv01@ptit.edu.vn');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.post.status).toBe('pending');
      expect(resolveMyPost(result.post.id, 'sv02@ptit.edu.vn')).toBe(false);
      expect(resolveMyPost(result.post.id, 'sv01@ptit.edu.vn')).toBe(true);
    }
  });
});

afterEach(() => {
  db.posts.splice(36);
  db.nextPostId = 37;
});
