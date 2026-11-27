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
    <section>
      <h1>Tin đăng</h1>
      <form method="get" className="filter-form">
        <label htmlFor="q">Tìm kiếm</label>
        <input id="q" name="q" defaultValue={q} />
        <label htmlFor="kind">Loại tin</label>
        <select id="kind" name="kind" defaultValue={kind}>
          <option>Tất cả</option><option>Thất lạc</option><option>Nhặt được</option>
        </select>
        <label htmlFor="sort">Sắp xếp</label>
        <select id="sort" name="sort" defaultValue={sort ?? ''}>
          <option value="">Mặc định</option><option value="date-desc">Mới nhất</option><option value="date-asc">Cũ nhất</option>
        </select>
        <button type="submit">Lọc</button>
      </form>
      <p>Có {posts.length} tin đang hiển thị</p>
      <p>Render lúc: {now.toLocaleTimeString('vi-VN', { hour12: false })}</p>
      {posts.length === 0 ? <p>Không có tin nào phù hợp</p> : (
        <table>
          <thead><tr><th>Tiêu đề</th><th>Loại tin</th><th>Địa điểm</th><th>Ngày</th></tr></thead>
          <tbody>{posts.map((post) => (
            <tr key={post.id}>
              <td><Link href={`/posts/${post.id}`}>{post.title}</Link></td>
              <td>{post.kind}</td><td>{post.place}</td><td>{formatDate(post.date)}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </section>
  );
}
