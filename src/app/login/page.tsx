import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const session = await auth();
  if (session?.user) redirect('/');
  const params = await searchParams;
  const callbackUrl = typeof params.callbackUrl === 'string' ? params.callbackUrl : '/my-posts';
  return (
    <main className="container">
      <h1>Đăng nhập</h1>
      <LoginForm callbackUrl={callbackUrl} />
    </main>
  );
}
