'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    void update();
  }, [pathname, update]);

  return (
    <header className="topbar">
      <nav aria-label="Điều hướng chính">
        <Link href="/">Trang chủ</Link>
        <Link href="/posts">Tin đăng</Link>
        {status === 'authenticated' ? (
          <>
            <span>Xin chào, {session.user.name} ({session.user.role})</span>
            <Link href="/my-posts">Tin của tôi</Link>
            {session.user.role === 'admin' && <Link href="/admin">Quản trị</Link>}
            <button type="button" onClick={() => signOut({ callbackUrl: '/' })}>Đăng xuất</button>
          </>
        ) : <Link href="/login">Đăng nhập</Link>}
      </nav>
    </header>
  );
}
