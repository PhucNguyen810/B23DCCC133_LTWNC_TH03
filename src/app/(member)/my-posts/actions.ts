'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { createMyPost, resolveMyPost } from '@/lib/my-posts';
import type { PostInput } from '@/lib/post-validate';

export interface PostActionState {
  message: string;
  errors: string[];
  success: boolean;
}

const readInput = (formData: FormData): PostInput => ({
  title: String(formData.get('title') ?? ''),
  kind: String(formData.get('kind') ?? ''),
  category: String(formData.get('category') ?? ''),
  place: String(formData.get('place') ?? ''),
  date: String(formData.get('date') ?? ''),
  description: String(formData.get('description') ?? ''),
});

export async function createPostAction(
  _previousState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const session = await auth();
  if (!session?.user.email) redirect('/login');
  if (!can(session.user.role, 'post:create')) throw new Error('Không có quyền');
  const result = createMyPost(readInput(formData), session.user.email);
  if (!result.ok) return { message: '', errors: result.errors, success: false };
  revalidatePath('/admin');
  revalidatePath('/my-posts');
  revalidatePath('/');
  return { message: 'Đã gửi tin, chờ quản trị viên duyệt.', errors: [], success: true };
}

export async function resolvePostAction(
  id: number,
  _previousState: PostActionState,
  _formData: FormData,
): Promise<PostActionState> {
  void _previousState;
  void _formData;
  const session = await auth();
  if (!session?.user.email) redirect('/login');
  if (!can(session.user.role, 'post:resolve')) redirect('/forbidden');
  if (!resolveMyPost(id, session.user.email)) {
    return { message: 'Không thể cập nhật tin này.', errors: [], success: false };
  }
  revalidatePath('/my-posts');
  revalidatePath('/');
  revalidatePath('/posts');
  revalidatePath(`/posts/${id}`);
  return { message: 'Đã đánh dấu tin là đã nhận lại.', errors: [], success: true };
}
