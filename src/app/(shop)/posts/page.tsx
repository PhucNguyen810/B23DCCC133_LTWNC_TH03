import Link from 'next/link';
import { formatDate } from '@/lib/format';
import { getPublicPosts, type PostFilters } from '@/lib/posts';
import type { Kind } from '@/types';

export default async function PostsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const kind = typeof params.kind === 'string' ? params.kind as Kind | 'Tất cả' : 'Tất cả';
  const sort = typeof params.sort === 'string' ? params.sort as PostFilters['sort'] : undefined;
  const posts = await getPublicPosts({ q, kind, sort });
  const now = new Date();
  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <p className="eyebrow">Cơ sở dữ liệu cộng đồng</p>
          <h1>Tin đăng</h1>
          <p className="page-intro">Tìm kiếm và kết nối về những món đồ thất lạc tại PTIT.</p>
        </div>
        <span className="count-chip">{posts.length} tin đang hiển thị</span>
      </header>
      <form method="get" className="filter-form" aria-label="Lọc tin đăng">
        <div className="filter-field filter-field-wide">
          <label htmlFor="q">Tìm kiếm</label>
          <input id="q" name="q" placeholder="Tên đồ vật, danh mục hoặc địa điểm" defaultValue={q} />
        </div>
        <div className="filter-field">
          <label htmlFor="kind">Loại tin</label>
          <select id="kind" name="kind" defaultValue={kind}>
            <option>Tất cả</option><option>Thất lạc</option><option>Nhặt được</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="sort">Sắp xếp</label>
          <select id="sort" name="sort" defaultValue={sort ?? ''}>
            <option value="">Mặc định</option><option value="date-desc">Mới nhất</option><option value="date-asc">Cũ nhất</option>
          </select>
        </div>
        <button type="submit">Áp dụng</button>
      </form>
      <div className="panel-heading">
        <div>
          <h2>Kết quả tìm kiếm</h2>
          <p>Cập nhật lúc {now.toLocaleTimeString('vi-VN', { hour12: false })}</p>
        </div>
      </div>
      {posts.length === 0 ? <p className="empty-state">Không có tin nào phù hợp. Hãy thử thay đổi từ khóa hoặc bộ lọc.</p> : (
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>Tiêu đề</th><th>Loại tin</th><th>Địa điểm</th><th>Ngày</th></tr></thead>
            <tbody>{posts.map((post) => (
              <tr key={post.id}>
                <td><Link href={`/posts/${post.id}`}>{post.title}</Link></td>
                <td><span className="kind-badge">{post.kind}</span></td>
                <td>{post.place}</td><td>{formatDate(post.date)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
