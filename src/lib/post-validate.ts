import { CATEGORIES, KINDS, PLACES } from '../data/posts';
import type { Category, Kind, Place } from '../types';

export interface PostInput {
  title: string;
  kind: string;
  category: string;
  place: string;
  date: string;
  description: string;
}

export interface ValidatedPostInput {
  title: string;
  kind: Kind;
  category: Category;
  place: Place;
  date: string;
  description: string;
}

export type ValidationResult =
  | { ok: true; value: ValidatedPostInput }
  | { ok: false; errors: string[] };

const isKind = (value: string): value is Kind => KINDS.some((kind) => kind === value);
const isCategory = (value: string): value is Category => CATEGORIES.some((category) => category === value);
const isPlace = (value: string): value is Place => PLACES.some((place) => place === value);

export const validatePost = (input: PostInput): ValidationResult => {
  const errors: string[] = [];
  const title = input.title.trim();
  const description = input.description.trim();
  const kind = isKind(input.kind) ? input.kind : undefined;
  const category = isCategory(input.category) ? input.category : undefined;
  const place = isPlace(input.place) ? input.place : undefined;
  if (!title) errors.push('Tiêu đề không được để trống');
  if (!description) errors.push('Mô tả không được để trống');
  if (!kind) errors.push('Loại tin không hợp lệ');
  if (!category) errors.push('Danh mục không hợp lệ');
  if (!place) errors.push('Địa điểm không hợp lệ');
  const date = new Date(`${input.date}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)
    || Number.isNaN(date.getTime())
    || date.toISOString().slice(0, 10) !== input.date) {
    errors.push('Ngày không hợp lệ');
  }
  if (errors.length) return { ok: false, errors };
  if (!kind || !category || !place) return { ok: false, errors: ['Dữ liệu không hợp lệ'] };
  return {
    ok: true,
    value: {
      title,
      kind,
      category,
      place,
      date: input.date,
      description,
    },
  };
};
