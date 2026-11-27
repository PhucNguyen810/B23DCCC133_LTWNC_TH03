import type { Role } from '../types';

export type Action = 'post:view' | 'post:create' | 'post:resolve' | 'post:moderate';

export const can = (role: Role | undefined, action: Action): boolean => {
  if (action === 'post:view') return true;
  if (action === 'post:create' || action === 'post:resolve') return role === 'member';
  return role === 'admin';
};
