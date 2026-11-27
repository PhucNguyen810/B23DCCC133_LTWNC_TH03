'use client';
import { useActionState } from 'react';
import { CATEGORIES, KINDS, PLACES } from '@/data/posts';
import { today, type PostFormState } from '@/lib/post-validate';

export type PostFormAction = (
  previousState: PostFormState,
  formData: FormData,
) => Promise<PostFormState>;

const initialState: PostFormState = { errors: {}, values: {} };

export default function PostForm({ action }: { action: PostFormAction }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  return (
    <form key={JSON.stringify(state.values)} className="post-form" action={formAction}>
      <label htmlFor="title">Tiêu đề</label>
      <input id="title" name="title" defaultValue={state.values.title ?? ''} />
      {state.errors.title && <p role="alert">{state.errors.title}</p>}

      <label htmlFor="kind">Loại tin</label>
      <select id="kind" name="kind" defaultValue={state.values.kind ?? ''}>
        <option value="">-- Chọn --</option>
        {KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
      </select>
      {state.errors.kind && <p role="alert">{state.errors.kind}</p>}

      <label htmlFor="category">Danh mục</label>
      <select id="category" name="category" defaultValue={state.values.category ?? ''}>
        <option value="">-- Chọn --</option>
        {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
      {state.errors.category && <p role="alert">{state.errors.category}</p>}

      <label htmlFor="place">Địa điểm</label>
      <select id="place" name="place" defaultValue={state.values.place ?? ''}>
        <option value="">-- Chọn --</option>
        {PLACES.map((place) => <option key={place} value={place}>{place}</option>)}
      </select>
      {state.errors.place && <p role="alert">{state.errors.place}</p>}

      <label htmlFor="date">Ngày</label>
      <input id="date" name="date" type="date" max={today()} defaultValue={state.values.date ?? ''} />
      {state.errors.date && <p role="alert">{state.errors.date}</p>}

      <label htmlFor="description">Mô tả</label>
      <textarea id="description" name="description" defaultValue={state.values.description ?? ''} />
      {state.errors.description && <p role="alert">{state.errors.description}</p>}

      <label htmlFor="contactType">Loại liên hệ</label>
      <select id="contactType" name="contactType" defaultValue={state.values.contactType ?? 'Zalo'}>
        <option value="Zalo">Zalo</option>
        <option value="SĐT">SĐT</option>
        <option value="Email">Email</option>
      </select>
      {state.errors.contactType && <p role="alert">{state.errors.contactType}</p>}

      <label htmlFor="contact">Thông tin liên hệ</label>
      <input id="contact" name="contact" defaultValue={state.values.contact ?? ''} />
      {state.errors.contact && <p role="alert">{state.errors.contact}</p>}

      <button className="button-submit" type="submit" disabled={pending}>
        {pending ? 'Đang gửi...' : 'Đăng tin'}
      </button>
      {state.message && <p role={state.ok ? 'status' : 'alert'}>{state.message}</p>}
    </form>
  );
}
