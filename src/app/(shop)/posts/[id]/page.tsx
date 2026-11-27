import type { Metadata } from 'next';
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
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h1>{post.title}</h1>
      <p>Loại tin: {post.kind}</p>
      <p>Danh mục: {post.category}</p>
      <p>Địa điểm: {post.place}</p>
      <p>Ngày: {formatDate(post.date)}</p>
      <p>Người đăng: {post.authorEmail}</p>
      <p>{post.description}</p>
      <p>Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN', { hour12: false })}</p>
    </article>
  );
}
