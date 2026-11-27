import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { NextResponse } from 'next/server';

export default auth((request) => {
  const role = request.auth?.user.role;
  const path = request.nextUrl.pathname;
  const isMyPosts = path === '/my-posts' || path.startsWith('/my-posts/');
  const isAdmin = path === '/admin' || path.startsWith('/admin/');
  if (!request.auth && (isMyPosts || isAdmin)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
  if (isAdmin && !can(role, 'post:moderate')) {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }
  return NextResponse.next();
});

export const config = { matcher: ['/my-posts/:path*', '/admin/:path*'] };
