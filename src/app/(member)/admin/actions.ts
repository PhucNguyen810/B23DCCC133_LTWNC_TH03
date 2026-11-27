'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { updatePostReview } from '@/lib/my-posts';

export async function moderatePost(id: number, status: 'approved' | 'hidden', _formData: FormData): Promise<void> {
  void _formData;
  const session = await auth();
  if (!can(session?.user.role, 'post:moderate')) throw new Error('Không có quyền');
  if (status !== 'approved' && status !== 'hidden') throw new Error('Trạng thái không hợp lệ');
  const changed = updatePostReview(id, status);
  if (changed) {
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/posts');
    revalidatePath(`/posts/${id}`);
  }
}
