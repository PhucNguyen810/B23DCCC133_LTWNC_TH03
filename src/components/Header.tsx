'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname() ?? '';
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    void update();
  }, [pathname, update]);

  return (
    <header className="topbar">
      <nav className="site-nav" aria-label="Điều hướng chính">
        <Link className="brand" href="/" aria-label="PTIT Found - Trang chủ">
          <span className="brand-mark" aria-hidden="true">PF</span>
          <span className="brand-copy">
            <span className="brand-name">PTIT <strong>Found</strong></span>
            <span className="brand-tagline">Cộng đồng tìm đồ thất lạc</span>
          </span>
        </Link>
        <div className="nav-links">
          <Link className={`nav-link${pathname === '/' ? ' is-active' : ''}`} href="/">Trang chủ</Link>
          <Link className={`nav-link${pathname.startsWith('/posts') ? ' is-active' : ''}`} href="/posts">Tin đăng</Link>
        </div>
        <div className="nav-actions">
          {status === 'authenticated' ? (
            <>
              <span className="welcome-message">
                Xin chào, {session.user.name} ({session.user.role})
              </span>
              <Link className={`nav-link${pathname.startsWith('/my-posts') ? ' is-active' : ''}`} href="/my-posts">Tin của tôi</Link>
              {session.user.role === 'admin' && (
                <Link className={`nav-link${pathname.startsWith('/admin') ? ' is-active' : ''}`} href="/admin">Quản trị</Link>
              )}
              <button className="button-quiet" type="button" onClick={() => signOut({ callbackUrl: '/' })}>Đăng xuất</button>
            </>
          ) : <Link className="button button-small" href="/login">Đăng nhập</Link>}
        </div>
      </nav>
    </header>
  );
}
