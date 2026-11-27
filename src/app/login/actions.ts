'use server';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export interface LoginState {
  error: string;
}

export async function loginAction(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const requestedCallback = String(formData.get('callbackUrl') ?? '/my-posts');
  const callbackUrl = requestedCallback.startsWith('/') && !requestedCallback.startsWith('//')
    ? requestedCallback
    : '/my-posts';

  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl });
    return { error: '' };
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Email hoặc mật khẩu không đúng' };
    throw error;
  }
}
