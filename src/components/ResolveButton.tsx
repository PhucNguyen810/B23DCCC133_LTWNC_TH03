'use client';
import { useActionState } from 'react';
import { resolvePostAction } from '@/app/(member)/my-posts/actions';

export default function ResolveButton({ id }: { id: number }) {
  const action = resolvePostAction.bind(null, id);
  const [state, formAction, pending] = useActionState(action, {
    message: '',
    errors: [] as string[],
    success: false,
  });
  return (
    <form action={formAction}>
      <button type="submit" disabled={pending}>{pending ? 'Đang cập nhật...' : 'Đánh dấu đã nhận lại'}</button>
      {state.message && <span role={state.success ? 'status' : 'alert'}> {state.message}</span>}
    </form>
  );
}
