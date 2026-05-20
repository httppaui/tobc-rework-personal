import { useRef, type ReactNode } from 'react';

type NavDropdownProps = {
  id: string;
  label: ReactNode;
  navClassName: string;
  isOpen: boolean;
  onOpen: () => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
  onMainClick: () => void;
  children: ReactNode;
};

export function NavDropdown({
  id,
  label,
  navClassName,
  isOpen,
  onOpen,
  onScheduleClose,
  onCancelClose,
  onMainClick,
  children,
}: NavDropdownProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className={`nav-link-wrap${isOpen ? ' is-dropdown-open' : ''}`}
      onMouseEnter={() => {
        onCancelClose();
        onOpen();
      }}
      onFocus={() => {
        onCancelClose();
        onOpen();
      }}
      onMouseLeave={(e) => {
        const related = e.relatedTarget;
        if (related instanceof Node && wrapRef.current?.contains(related)) return;
        if (related instanceof Element) {
          const sibling = related.closest('.nav-links .nav-link-wrap');
          if (sibling && sibling !== wrapRef.current) return;
        }
        onScheduleClose();
      }}
    >
      <button
        type="button"
        className={navClassName}
        id={id === 'courses' ? 'nav-courses' : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onMainClick}
      >
        {label} <i className="bi bi-chevron-down chevron" aria-hidden />
      </button>
      <div
        className="nav-dropdown"
        role="menu"
        onMouseEnter={onCancelClose}
        onMouseLeave={onScheduleClose}
      >
        {children}
      </div>
    </div>
  );
}

type NavDropdownItemProps = {
  label: string;
  onSelect: () => void;
};

export function NavDropdownItem({ label, onSelect }: NavDropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {label}
    </button>
  );
}
