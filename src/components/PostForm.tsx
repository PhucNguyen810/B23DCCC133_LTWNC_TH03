'use client';
import { useActionState } from 'react';
import { createPostAction } from '@/app/(member)/my-posts/actions';
import { CATEGORIES, KINDS, PLACES } from '@/data/posts';

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPostAction, {
    message: '',
    errors: [] as string[],
    success: false,
  });
  return (
    <form className="post-form" action={formAction}>
      <label htmlFor="title">Tiêu đề</label><input id="title" name="title" required />
      <label htmlFor="kind">Loại tin</label><select id="kind" name="kind">{KINDS.map((kind) => <option key={kind}>{kind}</option>)}</select>
      <label htmlFor="category">Danh mục</label><select id="category" name="category">{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
      <label htmlFor="place">Địa điểm</label><select id="place" name="place">{PLACES.map((place) => <option key={place}>{place}</option>)}</select>
      <label htmlFor="date">Ngày</label><input id="date" name="date" type="date" required />
      <label htmlFor="description">Mô tả</label><textarea id="description" name="description" required />
      <button className="button-submit" type="submit" disabled={pending}>{pending ? 'Đang gửi...' : 'Đăng tin'}</button>
      {state.message && <p role="status">{state.message}</p>}
      {state.errors.length > 0 && <ul role="alert">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    </form>
  );
}
