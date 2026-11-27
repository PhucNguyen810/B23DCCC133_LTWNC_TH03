import type { ReactNode } from 'react';

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <main className="member-shell">
      <div className="member-banner">
        <span className="member-banner-mark" aria-hidden="true">PT</span>
        <span>Khu vực thành viên</span>
      </div>
      {children}
    </main>
  );
}
