'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { resolvePost, submitPost } from '@/lib/my-posts';
import { toPostInput, validatePost, type PostFormState } from '@/lib/post-validate';

export async function createPostAction(
  previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  void previousState;
  const input = toPostInput(formData);
  const values = input;
  const session = await auth();
  if (!can(session?.user.role, 'post:create') || !session?.user.email) {
    return { errors: {}, values, message: 'Không có quyền' };
  }

  const errors = validatePost(input);
  if (Object.keys(errors).length > 0) return { errors, values };

  submitPost(session.user.email, input);
  revalidatePath('/my-posts');
  return {
    errors: {},
    values: {},
    message: 'Đã gửi tin, chờ kiểm duyệt',
    ok: true,
  };
}

export async function resolvePostAction(id: number, formData: FormData): Promise<void> {
  void formData;
  const session = await auth();
  if (!session?.user.email || !can(session.user.role, 'post:resolve')) {
    throw new Error('Không có quyền');
  }

  const result = resolvePost(session.user.email, id);
  if (result === 'not-found') throw new Error('Không tìm thấy tin đăng');
  if (result === 'forbidden') throw new Error('Không có quyền');
  if (result === 'not-approved') throw new Error('Tin đăng chưa được duyệt');

  revalidatePath('/my-posts');
  revalidatePath('/posts');
  revalidatePath('/');
  revalidatePath(`/posts/${id}`);
}
