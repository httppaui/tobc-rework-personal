import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'amber';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-deep text-white shadow-[0_2px_8px_rgba(0,85,94,0.3)] hover:bg-brand-navy hover:-translate-y-px',
  secondary:
    'border-[1.5px] border-brand-deep bg-transparent text-brand-deep hover:bg-brand-ivory hover:-translate-y-px',
  ghost:
    'border-[1.5px] border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
  amber:
    'bg-brand-orange text-ink shadow-[0_2px_8px_rgba(255,117,0,0.3)] hover:bg-[#e56a00] hover:-translate-y-px',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}) {
  const sizes = {
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-[22px] py-3 text-sm',
    lg: 'px-[30px] py-[15px] text-base',
  };
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
