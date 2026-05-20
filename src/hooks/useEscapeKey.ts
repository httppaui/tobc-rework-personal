import { useEffect } from 'react';

export function useEscapeKey(handlers: Array<() => void>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handlers.forEach((fn) => fn());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers]);
}
