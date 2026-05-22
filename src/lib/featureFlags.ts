/** Turn on in production when the API is live and VITE_API_URL is set (Vercel env). */
export const AUTH_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_AUTH_ENABLED === 'true';

export const AUTH_PAUSED_MESSAGE =
  'Sign-in is temporarily unavailable. You can still browse courses and partners.';
