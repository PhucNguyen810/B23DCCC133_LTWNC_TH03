import Link from 'next/link';

export default function PostNotFound() {
  return (
    <section className="page-section">
      <p className="eyebrow">Không tìm thấy</p>
      <h1>Không tìm thấy tin đăng</h1>
      <p className="page-intro">Tin này có thể đã bị ẩn hoặc không còn tồn tại.</p>
      <div className="pagination-action">
        <Link className="button" href="/posts">Quay lại danh sách tin</Link>
      </div>
    </section>
  );
}
