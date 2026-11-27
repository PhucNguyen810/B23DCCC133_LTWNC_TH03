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
      <div className="form-field form-field-wide">
        <label htmlFor="title">Tiêu đề</label>
        <input id="title" name="title" defaultValue={state.values.title ?? ''} aria-describedby={state.errors.title ? 'title-error' : undefined} />
        {state.errors.title && <p id="title-error" role="alert">{state.errors.title}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="kind">Loại tin</label>
        <select id="kind" name="kind" defaultValue={state.values.kind ?? ''} aria-describedby={state.errors.kind ? 'kind-error' : undefined}>
          <option value="">-- Chọn --</option>
          {KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
        </select>
        {state.errors.kind && <p id="kind-error" role="alert">{state.errors.kind}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="category">Danh mục</label>
        <select id="category" name="category" defaultValue={state.values.category ?? ''} aria-describedby={state.errors.category ? 'category-error' : undefined}>
          <option value="">-- Chọn --</option>
          {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        {state.errors.category && <p id="category-error" role="alert">{state.errors.category}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="place">Địa điểm</label>
        <select id="place" name="place" defaultValue={state.values.place ?? ''} aria-describedby={state.errors.place ? 'place-error' : undefined}>
          <option value="">-- Chọn --</option>
          {PLACES.map((place) => <option key={place} value={place}>{place}</option>)}
        </select>
        {state.errors.place && <p id="place-error" role="alert">{state.errors.place}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="date">Ngày</label>
        <input id="date" name="date" type="date" max={today()} defaultValue={state.values.date ?? ''} aria-describedby={state.errors.date ? 'date-error' : undefined} />
        {state.errors.date && <p id="date-error" role="alert">{state.errors.date}</p>}
      </div>

      <div className="form-field form-field-wide">
        <label htmlFor="description">Mô tả</label>
        <textarea id="description" name="description" defaultValue={state.values.description ?? ''} aria-describedby={state.errors.description ? 'description-error' : undefined} />
        {state.errors.description && <p id="description-error" role="alert">{state.errors.description}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="contactType">Loại liên hệ</label>
        <select id="contactType" name="contactType" defaultValue={state.values.contactType ?? 'Zalo'} aria-describedby={state.errors.contactType ? 'contactType-error' : undefined}>
          <option value="Zalo">Zalo</option>
          <option value="SĐT">SĐT</option>
          <option value="Email">Email</option>
        </select>
        {state.errors.contactType && <p id="contactType-error" role="alert">{state.errors.contactType}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="contact">Thông tin liên hệ</label>
        <input id="contact" name="contact" defaultValue={state.values.contact ?? ''} aria-describedby={state.errors.contact ? 'contact-error' : undefined} />
        {state.errors.contact && <p id="contact-error" role="alert">{state.errors.contact}</p>}
      </div>

      <button className="button-submit form-submit" type="submit" disabled={pending}>
        {pending ? 'Đang gửi...' : 'Đăng tin'}
      </button>
      {state.message && <p className="form-message" role={state.ok ? 'status' : 'alert'}>{state.message}</p>}
    </form>
  );
}
