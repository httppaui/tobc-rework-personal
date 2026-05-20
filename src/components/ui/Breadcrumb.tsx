import { useApp } from '../../context/AppProvider';
import type { PageId } from '../../types';

export function Breadcrumb({ current }: { current: string }) {
  const { navigateTo } = useApp();
  return (
    <nav className="mb-4 flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
      <button type="button" className="hover:text-white" onClick={() => navigateTo('home')}>
        Home
      </button>
      <span aria-hidden>/</span>
      <span className="text-white/90" aria-current="page">
        {current}
      </span>
    </nav>
  );
}

export function BreadcrumbLight({ current }: { current: string }) {
  const { navigateTo } = useApp();
  return (
    <nav className="mb-4 flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
      <button type="button" className="text-brand-deep hover:underline" onClick={() => navigateTo('home')}>
        Home
      </button>
      <span aria-hidden>/</span>
      <span className="text-ink" aria-current="page">
        {current}
      </span>
    </nav>
  );
}

export type { PageId };
