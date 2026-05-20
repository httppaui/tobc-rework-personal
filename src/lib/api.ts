export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

type ErrorBody = { error?: string };

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number }> {
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
        status: res.status,
      };
    }

    return { ok: true, data: body as T };
  } catch {
    return {
      ok: false,
      error: 'Cannot reach the server. Run npm run dev (starts API + app).',
      status: 0,
    };
  }
}
