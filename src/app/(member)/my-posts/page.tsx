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
  <section className="page-section my-posts-page">
    <header className="page-header">
      <div>
        <p className="eyebrow">Bảng điều khiển cá nhân</p>
        <h1>Tin đăng của tôi</h1>
        <p className="page-intro">Tạo tin mới, theo dõi trạng thái và cập nhật những món đồ đã tìm thấy.</p>
      </div>
      <span className="count-chip">{result.total} tin trong tài khoản</span>
    </header>

    <section className="panel panel-muted">
      <div className="panel-heading">
        <div>
          <h2>Đăng tin tìm đồ</h2>
          <p>Tin mới sẽ được gửi đến quản trị viên để kiểm duyệt.</p>
        </div>
      </div>
      <PostForm action={createPostAction} />
    </section>

    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Danh sách tin đã đăng</h2>
          <p>Hiển thị {result.items.length} / {result.total} tin</p>
        </div>
      </div>

      <form method="get" className="filter-form">
        <div className="filter-field">
          <label htmlFor="status">Lọc theo trạng thái</label>
          <select id="status" name="status" defaultValue={status}>
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đang hiển thị</option>
            <option value="hidden">Đã ẩn</option>
          </select>
        </div>
        <button type="submit">Lọc tin</button>
      </form>

      {result.items.length === 0 ? <p className="empty-state">Chưa có tin đăng phù hợp.</p> : (
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>Tiêu đề</th><th>Ngày</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>{result.items.map((post) => {
              const label = post.resolved ? 'Đã nhận lại' : statusLabels[post.status];
              const statusTone = post.resolved ? 'resolved' : post.status;
              const resolveAction = resolvePostAction.bind(null, post.id);
              return (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{formatDate(post.date)}</td>
                  <td><span className={`status-badge status-${statusTone}`}>{label}</span></td>
                  <td>
                    {canResolve && post.status === 'approved' && !post.resolved && (
                      <form action={resolveAction}>
                        <button className="button button-outline button-small" type="submit">Đánh dấu đã nhận lại</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
      {result.nextCursor !== null
        ? <div className="pagination-action"><Link className="button button-outline" href={`/my-posts?${nextParams.toString()}`}>Xem thêm</Link></div>
        : <p className="page-intro">Đã hiển thị hết tin</p>}
    </section>
    </section>
  );
}
