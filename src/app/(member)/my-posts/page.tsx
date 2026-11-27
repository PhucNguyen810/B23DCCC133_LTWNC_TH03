import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { listMine, parseStatus } from '@/lib/my-posts';
import { formatDate } from '@/lib/format';
import { createPostAction, resolvePostAction } from './actions';
import PostForm from '@/components/PostForm';
import type { PostStatus } from '@/types';

type SearchParams = Record<string, string | string[] | undefined>;

const one = (value: string | string[] | undefined): string => typeof value === 'string' ? value : '';
const statusLabels: Record<PostStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đang hiển thị',
  hidden: 'Đã ẩn',
};

export const metadata: Metadata = { robots: { index: false } };

export default async function MyPostsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user.email) redirect('/login');
  const params = await searchParams;
  const status = parseStatus(one(params.status));
  const requestedLimit = Number(one(params.limit));
  const limit = Number.isSafeInteger(requestedLimit) && requestedLimit > 0 ? requestedLimit : 8;
  const result = listMine(session.user.email, status, 0, limit);
  const canResolve = can(session.user.role, 'post:resolve');

  const nextParams = new URLSearchParams();
  if (status) nextParams.set('status', status);
  nextParams.set('limit', String(limit + 8));

  return (
    <section>
      <h1>Tin đăng của tôi</h1>
      <PostForm action={createPostAction} />

      <form method="get" className="filter-form">
        <label htmlFor="status">Trạng thái</label>
        <select id="status" name="status" defaultValue={status}>
          <option value="">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đang hiển thị</option>
          <option value="hidden">Đã ẩn</option>
        </select>
        <button type="submit">Lọc</button>
      </form>

      <p>Hiển thị {result.items.length} / {result.total} tin</p>
      {result.items.length === 0 ? <p>Chưa có tin đăng phù hợp.</p> : (
        <table>
          <thead><tr><th>Tiêu đề</th><th>Ngày</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>{result.items.map((post) => {
            const label = post.resolved ? 'Đã nhận lại' : statusLabels[post.status];
            const resolveAction = resolvePostAction.bind(null, post.id);
            return (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{formatDate(post.date)}</td>
                <td>{label}</td>
                <td>
                  {canResolve && post.status === 'approved' && !post.resolved && (
                    <form action={resolveAction}>
                      <button type="submit">Đánh dấu đã nhận lại</button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      )}
      {result.nextCursor !== null
        ? <Link className="button" href={`/my-posts?${nextParams.toString()}`}>Xem thêm</Link>
        : <p>Đã hiển thị hết tin</p>}
    </section>
  );
}
