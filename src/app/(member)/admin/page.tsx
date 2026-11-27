import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { getPendingPosts, getPostStatusCounts } from '@/lib/my-posts';
import ReviewButtons from '@/components/ReviewButtons';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { robots: { index: false } };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!can(session.user.role, 'post:moderate')) redirect('/forbidden');
  const pending = getPendingPosts();
  const counts = getPostStatusCounts();
  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <p className="eyebrow">Quản trị hệ thống</p>
          <h1>Kiểm duyệt tin đăng</h1>
          <p className="page-intro">Xem lại thông tin và quyết định hiển thị tin trong cộng đồng.</p>
        </div>
        <span className="count-chip">{counts.pending} tin đang chờ</span>
      </header>

      <div className="stats-grid" aria-label="Thống kê trạng thái tin đăng">
        <div className="stat-card"><span>Chờ duyệt:</span><strong>{counts.pending}</strong></div>
        <div className="stat-card"><span>Đang hiển thị:</span><strong>{counts.approved}</strong></div>
        <div className="stat-card"><span>Đã ẩn:</span><strong>{counts.hidden}</strong></div>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Danh sách chờ duyệt</h2>
            <p>Kiểm tra tiêu đề, ngày đăng và thông tin người đăng trước khi xử lý.</p>
          </div>
        </div>
        {pending.length === 0 ? <p className="empty-state">Không có tin chờ duyệt.</p> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Tiêu đề</th><th>Ngày</th><th>Email người đăng</th><th>Thao tác</th></tr></thead>
              <tbody>{pending.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{formatDate(post.date)}</td>
                  <td>{post.authorEmail}</td>
                  <td><ReviewButtons id={post.id} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
