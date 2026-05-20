import type { ReactNode } from 'react';

const tones: Record<string, string> = {
  teal: 'bg-brand-sky/60 text-brand-navy',
  amber: 'bg-[#ffe8cc] text-[#b34d00]',
  green: 'bg-emerald-100 text-emerald-800',
  purple: 'bg-violet-100 text-violet-800',
  outline: 'border border-brand-teal/60 text-brand-deep bg-transparent',
  white: 'border border-white/20 bg-white/15 text-white',
};

export function Badge({
  tone = 'teal',
  children,
  className = '',
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
