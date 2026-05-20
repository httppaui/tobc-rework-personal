import { apiRequest } from './api';
import type { AuthUser } from '../types';

export async function updateProfileName(name: string): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  const result = await apiRequest<{ user: AuthUser }>('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
  return result.ok ? { ok: true, user: result.data.user } : { ok: false, error: result.error };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await apiRequest<{ ok: true }>('/api/profile/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}
