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
    <section>
      <h1>Kiểm duyệt tin đăng</h1>
      <p>Chờ duyệt: {counts.pending} | Đang hiển thị: {counts.approved} | Đã ẩn: {counts.hidden}</p>
      {pending.length === 0 ? <p>Không có tin chờ duyệt</p> : (
        <table>
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
      )}
    </section>
  );
}
