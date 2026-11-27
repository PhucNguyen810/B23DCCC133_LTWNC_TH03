import { db } from './db';
import type { Kind, Post } from '../types';

export interface PostFilters { q?: string; kind?: Kind | 'Tất cả'; sort?: 'date-desc' | 'date-asc' }

export const getPublicPosts = async (filters: PostFilters = {}): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  let posts = db.posts.filter((post) => post.status === 'approved' && !post.resolved);
  if (filters.q) {
    const q = filters.q.toLocaleLowerCase('vi');
    posts = posts.filter((post) => post.title.toLocaleLowerCase('vi').includes(q));
  }
  if (filters.kind && filters.kind !== 'Tất cả') posts = posts.filter((post) => post.kind === filters.kind);
  const result = [...posts];
  if (filters.sort === 'date-desc') result.sort((a, b) => b.date.localeCompare(a.date));
  if (filters.sort === 'date-asc') result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
};

export const getPublicPost = async (id: number): Promise<Post | undefined> => {
  return db.posts.find((post) => post.id === id && post.status === 'approved' && !post.resolved);
};
