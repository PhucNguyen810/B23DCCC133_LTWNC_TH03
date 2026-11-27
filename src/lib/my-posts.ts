import { db } from './db';
import { validatePost, type PostInput } from './post-validate';
import type { Post, PostStatus } from '../types';

export interface PostStatusCounts {
  pending: number;
  approved: number;
  hidden: number;
}

export interface MyPostsQuery {
  q?: string;
  status?: PostStatus | 'all';
  page?: number;
  pageSize?: number;
}

export interface MyPostsPage {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export const getMyPosts = (email: string, query: MyPostsQuery = {}): MyPostsPage => {
  const pageSize = Math.max(1, query.pageSize ?? 10);
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const q = query.q?.trim().toLocaleLowerCase('vi');
  const filtered = db.posts.filter((post) =>
    post.authorEmail === email
    && (!q || post.title.toLocaleLowerCase('vi').includes(q))
    && (!query.status || query.status === 'all' || post.status === query.status),
  );
  const visible = filtered.slice(0, page * pageSize);
  return { posts: visible, total: filtered.length, page, pageSize, hasMore: visible.length < filtered.length };
};

export const getPendingPosts = (): Post[] => db.posts.filter((post) => post.status === 'pending');

export const getPostStatusCounts = (): PostStatusCounts => ({
  pending: db.posts.filter((post) => post.status === 'pending').length,
  approved: db.posts.filter((post) => post.status === 'approved').length,
  hidden: db.posts.filter((post) => post.status === 'hidden').length,
});

export const createMyPost = (input: PostInput, authorEmail: string):
  | { ok: true; post: Post }
  | { ok: false; errors: string[] } => {
  const validation = validatePost(input);
  if (!validation.ok) return validation;
  const post: Post = {
    id: db.nextPostId++,
    ...validation.value,
    authorEmail,
    status: 'pending',
    resolved: false,
  };
  db.posts.push(post);
  return { ok: true, post };
};

export const resolveMyPost = (id: number, email: string): boolean => {
  const post = db.posts.find((item) => item.id === id && item.authorEmail === email);
  if (!post || post.resolved) return false;
  post.resolved = true;
  return true;
};

export const updatePostReview = (id: number, status: Extract<PostStatus, 'approved' | 'hidden'>): boolean => {
  const post = db.posts.find((item) => item.id === id);
  if (!post || post.status !== 'pending') return false;
  post.status = status;
  return true;
};
