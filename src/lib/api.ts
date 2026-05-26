export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

type ErrorBody = { error?: string };

/** True when production build has an explicit API origin (required on Vercel/static hosts). */
export function isApiConfigured(): boolean {
  return Boolean(API_BASE) || !import.meta.env.PROD;
}

export function productionApiSetupError(): string | null {
  if (import.meta.env.PROD && !API_BASE) {
    return (
      'This deployment is not connected to the TOBC API. In Vercel, set VITE_API_URL to your hosted API URL ' +
      '(for example https://api.yoursite.com), then redeploy. See docs/DEPLOY.md.'
    );
  }
  return null;
}

function networkErrorMessage(): string {
  if (productionApiSetupError()) return productionApiSetupError()!;
  if (import.meta.env.PROD) {
    return 'Cannot reach the API. Check that the API is running, VITE_API_URL is correct, and CLIENT_ORIGIN on the API includes this site URL.';
  }
  return 'Cannot reach the server. Run npm run dev (starts API + app).';
}

function nonJsonApiMessage(): string {
  if (productionApiSetupError()) return productionApiSetupError()!;
  if (import.meta.env.PROD) {
    return (
      'The server returned an invalid response (often the static site HTML). Set VITE_API_URL on Vercel to your API URL and redeploy.'
    );
  }
  return networkErrorMessage();
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number }> {
  const setupErr = productionApiSetupError();
  if (setupErr) {
    return { ok: false, error: setupErr, status: 0 };
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers as Record<string, string> | undefined),
      },
    });

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return { ok: false, error: nonJsonApiMessage(), status: res.status };
    }

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
    return { ok: false, error: networkErrorMessage(), status: 0 };
  }
}
