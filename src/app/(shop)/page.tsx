import Link from 'next/link';
import { getPublicPosts } from '@/lib/posts';

export default async function HomePage() {
  const posts = await getPublicPosts();
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Cộng đồng sinh viên PTIT</p>
          <h1>Thất lạc hay nhặt được?<br />Hãy bắt đầu tìm ở đây.</h1>
          <p className="hero-lead">
            Nơi kết nối người đánh rơi và người nhặt được, giúp đồ vật sớm trở về đúng chủ nhân.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/posts">Tìm tin đăng</Link>
            <Link className="button button-outline" href="/login?callbackUrl=%2Fmy-posts">Đăng tin tìm đồ</Link>
          </div>
          <p className="hero-footnote">
            <span className="live-dot" aria-hidden="true" />
            {posts.length} tin đang hiển thị trong cộng đồng PTIT
          </p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-card">
            <p className="visual-label">PTIT FOUND · KẾT NỐI CỘNG ĐỒNG</p>
            <div className="visual-search" />
            <h2>Cùng nhau tìm lại</h2>
            <p>Một thông tin nhỏ, một món đồ tìm về.</p>
            <div className="visual-tags">
              <span>Thẻ sinh viên</span>
              <span>Chìa khóa</span>
            </div>
          </div>
        </div>
      </section>
      <section className="home-highlights" aria-label="Lợi ích của PTIT Found">
        <article className="highlight-card">
          <span className="highlight-number">01 · TÌM KIẾM</span>
          <h2>Tìm tin nhanh chóng</h2>
          <p>Lọc tin theo loại và thời gian để thu hẹp kết quả bạn cần.</p>
        </article>
        <article className="highlight-card">
          <span className="highlight-number">02 · CHIA SẺ</span>
          <h2>Đăng tin dễ dàng</h2>
          <p>Mô tả món đồ và địa điểm để cộng đồng cùng hỗ trợ tìm kiếm.</p>
        </article>
        <article className="highlight-card">
          <span className="highlight-number">03 · KẾT NỐI</span>
          <h2>Trao lại đúng chủ</h2>
          <p>Thông tin liên hệ giúp người nhặt được kết nối trực tiếp với bạn.</p>
        </article>
      </section>
    </>
  );
}
