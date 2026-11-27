'use client';
import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, { error: '' });
  return (
    <form action={formAction} className="login-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="login-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="name@ptit.edu.vn" />
      </div>
      <div className="login-field">
        <label htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="Nhập mật khẩu" />
      </div>
      <button className="button-submit" type="submit" disabled={pending}>
        {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
