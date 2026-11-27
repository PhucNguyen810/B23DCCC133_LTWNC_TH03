import Link from 'next/link';
import { getPublicPosts } from '@/lib/posts';

export default async function HomePage() {
  const posts = await getPublicPosts();
  return (
    <section className="hero">
      <h1>PTIT Found – Tìm đồ thất lạc</h1>
      <p>{posts.length} tin đang hiển thị</p>
      <Link className="button" href="/posts">Xem tất cả tin</Link>
    </section>
  );
}
