import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { getMyPosts } from '@/lib/my-posts';
import type { PostStatus } from '@/types';
import PostForm from '@/components/PostForm';
import ResolveButton from '@/components/ResolveButton';

type SearchParams = Record<string, string | string[] | undefined>;

const one = (value: string | string[] | undefined): string => typeof value === 'string' ? value : '';
const statusValues: PostStatus[] = ['pending', 'approved', 'hidden'];

export const metadata: Metadata = { robots: { index: false } };

export default async function MyPostsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user.email) redirect('/login');
  const params = await searchParams;
  const q = one(params.q);
  const requestedStatus = one(params.status);
  const status = statusValues.includes(requestedStatus as PostStatus) ? requestedStatus as PostStatus : 'all';
  const requestedPage = Number(one(params.page));
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const result = getMyPosts(session.user.email, { q, status, page });
  const canCreate = can(session.user.role, 'post:create');
  const canResolve = can(session.user.role, 'post:resolve');
  const nextParams = new URLSearchParams();
  if (q) nextParams.set('q', q);
  if (status !== 'all') nextParams.set('status', status);
  nextParams.set('page', String(page + 1));

  return (
    <section>
      <h1>Tin đăng của tôi</h1>
      {canCreate && <PostForm />}
      <h2>Danh sách</h2>
      <form method="get" className="filter-form">
        <label htmlFor="my-posts-q">Tìm theo tiêu đề</label>
        <input id="my-posts-q" name="q" defaultValue={q} />
        <label htmlFor="my-posts-status">Trạng thái</label>
        <select id="my-posts-status" name="status" defaultValue={status}>
          <option value="all">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đang hiển thị</option>
          <option value="hidden">Đã ẩn</option>
        </select>
        <button type="submit">Lọc</button>
      </form>
      <p>{result.total} tin phù hợp</p>
      {result.posts.length === 0 ? <p>Chưa có tin đăng phù hợp.</p> : result.posts.map((post) => (
        <article key={post.id}>
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
          <span> — {post.status} — {post.resolved ? 'Đã nhận lại' : 'Chưa nhận lại'}</span>
          {canResolve && !post.resolved && <ResolveButton id={post.id} />}
        </article>
      ))}
      {result.hasMore && <Link className="button" href={`/my-posts?${nextParams.toString()}`}>Xem thêm</Link>}
    </section>
  );
}
