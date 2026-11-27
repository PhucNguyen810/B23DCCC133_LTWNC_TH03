import { db } from './db';
import { toValidatedPostInput, type PostInput } from './post-validate';
import type { Post, PostStatus } from '../types';

export interface MyPostsPage {
  items: Post[];
  nextCursor: number | null;
  total: number;
}

export interface PostStatusCounts {
  pending: number;
  approved: number;
  hidden: number;
}

export const parseStatus = (value: unknown): PostStatus | '' =>
  value === 'pending' || value === 'approved' || value === 'hidden' ? value : '';

export const listMine = (
  email: string,
  status: PostStatus | '',
  cursor = 0,
  size = 8,
): MyPostsPage => {
  const start = Number.isFinite(cursor) ? Math.max(0, Math.floor(cursor)) : 0;
  const pageSize = Number.isFinite(size) ? Math.max(1, Math.floor(size)) : 8;
  const matching = db.posts.filter((post) =>
    post.authorEmail === email && (!status || post.status === status),
  );
  const items = matching.slice(start, start + pageSize);
  const nextCursor = start + items.length < matching.length ? start + items.length : null;
  return { items, nextCursor, total: matching.length };
};

export const getPendingPosts = (): Post[] => db.posts.filter((post) => post.status === 'pending');

export const getPostStatusCounts = (): PostStatusCounts => ({
  pending: db.posts.filter((post) => post.status === 'pending').length,
  approved: db.posts.filter((post) => post.status === 'approved').length,
  hidden: db.posts.filter((post) => post.status === 'hidden').length,
});

export const submitPost = (email: string, input: PostInput): Post => {
  const validated = toValidatedPostInput(input);
  if (!validated) throw new Error('Dữ liệu bài đăng chưa hợp lệ');
  const post: Post = {
    id: db.nextPostId++,
    title: validated.title,
    kind: validated.kind,
    category: validated.category,
    place: validated.place,
    date: validated.date,
    description: `${validated.description}\nLiên hệ: ${validated.contactType} ${validated.contact.trim()}`,
    authorEmail: email,
    status: 'pending',
    resolved: false,
  };
  db.posts.unshift(post);
  return post;
};

export type ResolvePostResult = 'not-found' | 'forbidden' | 'not-approved' | 'ok';

export const resolvePost = (email: string, id: number): ResolvePostResult => {
  const post = db.posts.find((item) => item.id === id);
  if (!post) return 'not-found';
  if (post.authorEmail !== email) return 'forbidden';
  if (post.status !== 'approved') return 'not-approved';
  post.resolved = true;
  return 'ok';
};

export const updatePostReview = (id: number, status: Extract<PostStatus, 'approved' | 'hidden'>): boolean => {
  const post = db.posts.find((item) => item.id === id);
  if (!post || post.status !== 'pending') return false;
  post.status = status;
  return true;
};
