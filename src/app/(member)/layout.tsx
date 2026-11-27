import type { ReactNode } from 'react';

export default function MemberLayout({ children }: { children: ReactNode }) {
  return <main className="container"><p><strong>Khu vực thành viên</strong></p>{children}</main>;
}
