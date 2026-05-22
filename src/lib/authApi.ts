import type { AuthUser } from '../types';
import { apiRequest } from './api';

type AuthResponse = { user: AuthUser };

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const result = await apiRequest<AuthResponse>('/api/auth/me');
  return result.ok ? result.data.user : null;
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  const result = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return result.ok ? { ok: true, user: result.data.user } : { ok: false, error: result.error };
}

export async function loginAccount(email: string, password: string): Promise<AuthResult> {
  const result = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return result.ok ? { ok: true, user: result.data.user } : { ok: false, error: result.error };
}

export async function logoutAccount(): Promise<void> {
  await apiRequest('/api/auth/logout', { method: 'POST' });
}

export async function checkApiHealth(): Promise<boolean> {
  const result = await apiRequest<{ ok?: boolean; service?: string }>('/api/health');
  return result.ok && result.data.ok === true && result.data.service === 'tobc-api';
}
