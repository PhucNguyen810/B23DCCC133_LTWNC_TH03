import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicPost, getPublicPosts } from '@/lib/posts';
import { formatDate } from '@/lib/format';

export const revalidate = 30;

export async function generateStaticParams() {
  const posts = await getPublicPosts();
  return posts.slice(0, 10).map((post) => ({ id: String(post.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublicPost(Number(id));
  if (!post) return { title: 'Không tìm thấy tin đăng' };
  const title = `${post.title} – ${post.place}`;
  return { title, description: post.description, openGraph: { title, description: post.description } };
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPublicPost(Number(id));
  if (!post) notFound();
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'http://localhost:3000/' },
      { '@type': 'ListItem', position: 2, name: 'Tin đăng', item: 'http://localhost:3000/posts' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `http://localhost:3000/posts/${post.id}` },
    ],
  };
  return (
    <article className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Link className="detail-back" href="/posts">← Quay lại danh sách tin</Link>
      <div className="detail-title-row">
        <span className="kind-badge">{post.kind}</span>
        <h1>{post.title}</h1>
      </div>
      <div className="detail-grid">
        <div className="detail-item"><span>Danh mục</span><strong>{post.category}</strong></div>
        <div className="detail-item"><span>Địa điểm</span><strong>{post.place}</strong></div>
        <div className="detail-item"><span>Ngày đăng</span><strong>{formatDate(post.date)}</strong></div>
        <div className="detail-item"><span>Người đăng</span><strong>{post.authorEmail}</strong></div>
      </div>
      <p className="detail-description">{post.description}</p>
      <p className="detail-updated">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', { hour12: false })}</p>
    </article>
  );
}
