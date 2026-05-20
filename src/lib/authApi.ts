import type { AuthUser } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

type AuthResponse = { user: AuthUser };
type ErrorBody = { error?: string };

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

async function request<T>(path: string, init?: RequestInit): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers as Record<string, string> | undefined),
      },
    });

    const body = (await res.json().catch(() => ({}))) as T & ErrorBody;

    if (!res.ok) {
      return {
        ok: false,
        error: body.error ?? 'Something went wrong. Please try again.',
      };
    }

    return { ok: true, data: body as T };
  } catch {
    return {
      ok: false,
      error: 'Cannot reach the server. Run npm run dev (starts API + app).',
    };
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const result = await request<AuthResponse>('/api/auth/me');
  return result.ok ? result.data.user : null;
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  const result = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return result.ok ? { ok: true, user: result.data.user } : { ok: false, error: result.error };
}

export async function loginAccount(email: string, password: string): Promise<AuthResult> {
  const result = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return result.ok ? { ok: true, user: result.data.user } : { ok: false, error: result.error };
}

export async function logoutAccount(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' });
}
