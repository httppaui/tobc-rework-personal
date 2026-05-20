import type { ReactNode } from 'react';
import { useApp } from '../../context/AppProvider';

type ShelfPageHeroProps = {
  breadcrumbLabel: string;
  title: string;
  description: string;
  status?: ReactNode;
};

export function ShelfPageHero({ breadcrumbLabel, title, description, status }: ShelfPageHeroProps) {
  const { navigateTo } = useApp();

  return (
    <div className="chat-page-hero shelf-page-hero">
      <div className="container">
        <nav className="breadcrumb breadcrumb--on-dark" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>
            Home
          </button>
          <span className="sep">/</span>
          <span className="current" aria-current="page">
            {breadcrumbLabel}
          </span>
        </nav>
        <div className="chat-page-hero-inner">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {status ?? null}
        </div>
      </div>
    </div>
  );
}
