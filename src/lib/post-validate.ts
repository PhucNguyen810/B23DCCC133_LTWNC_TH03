import { CATEGORIES, KINDS, PLACES } from '../data/posts';
import type { Category, Kind, Place } from '../types';

export interface PostInput {
  title: string;
  kind: string;
  category: string;
  place: string;
  date: string;
  description: string;
  contactType: string;
  contact: string;
}

export type PostErrors = Partial<Record<keyof PostInput, string>>;

export interface PostFormState {
  errors: PostErrors;
  values: Partial<PostInput>;
  message?: string;
  ok?: boolean;
}

export interface ValidatedPostInput extends Omit<PostInput, 'kind' | 'category' | 'place'> {
  kind: Kind;
  category: Category;
  place: Place;
}

const fieldValue = (raw: FormData | Record<string, unknown>, key: keyof PostInput): unknown =>
  raw instanceof FormData ? raw.get(key) : raw[key];

const asString = (value: unknown): string => typeof value === 'string' ? value : '';

export const toPostInput = (raw: FormData | Record<string, unknown>): PostInput => {
  const contactTypeValue = fieldValue(raw, 'contactType');
  return {
    title: asString(fieldValue(raw, 'title')),
    kind: asString(fieldValue(raw, 'kind')),
    category: asString(fieldValue(raw, 'category')),
    place: asString(fieldValue(raw, 'place')),
    date: asString(fieldValue(raw, 'date')),
    description: asString(fieldValue(raw, 'description')),
    contactType: contactTypeValue === null || contactTypeValue === undefined
      ? 'Zalo'
      : asString(contactTypeValue),
    contact: asString(fieldValue(raw, 'contact')),
  };
};

export const today = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const validatePost = (input: PostInput): PostErrors => {
  const errors: PostErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();

  if (title.length < 5) errors.title = 'Tiêu đề tối thiểu 5 ký tự';
  else if (title.length > 80) errors.title = 'Tiêu đề tối đa 80 ký tự';

  if (!KINDS.some((kind) => kind === input.kind)) errors.kind = 'Hãy chọn loại tin';
  if (!CATEGORIES.some((category) => category === input.category)) errors.category = 'Hãy chọn danh mục';
  if (!PLACES.some((place) => place === input.place)) errors.place = 'Hãy chọn địa điểm';

  if (!isDate(input.date)) errors.date = 'Hãy chọn ngày';
  else if (input.date > today()) errors.date = 'Ngày không được ở tương lai';

  if (description.length < 20) errors.description = 'Mô tả tối thiểu 20 ký tự';

  if (input.contactType === 'Zalo') {
    if (!/^0\d{9}$/.test(input.contact.trim())) {
      errors.contact = 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0';
    }
  } else if (input.contactType === 'SĐT') {
    if (!/^0\d{9}$/.test(input.contact.trim())) {
      errors.contact = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0';
    }
  } else if (input.contactType === 'Email') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contact.trim())) {
      errors.contact = 'Email không hợp lệ';
    }
  } else {
    errors.contactType = 'Hãy chọn loại liên hệ';
  }

  return errors;
};

export const toValidatedPostInput = (input: PostInput): ValidatedPostInput | undefined => {
  if (Object.keys(validatePost(input)).length > 0) return undefined;
  const kind = KINDS.find((value) => value === input.kind);
  const category = CATEGORIES.find((value) => value === input.category);
  const place = PLACES.find((value) => value === input.place);
  if (!kind || !category || !place) return undefined;
  return { ...input, title: input.title.trim(), description: input.description.trim(), kind, category, place };
};
