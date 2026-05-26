import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PartnerCard } from '../components/partners/PartnerCard';
import { CatalogLayoutToolbar } from '../components/layout/CatalogLayoutToolbar';
import { PartnersFilters } from '../components/partners/PartnersFilters';
import {
  PARTNER_BUSINESS_TYPES,
  PARTNER_CATEGORIES,
  PARTNER_CITIES,
} from '../data/partnerFilterOptions';
import { PARTNERS, PARTNERS_TOTAL } from '../data/partners';
import { useApp } from '../context/AppProvider';
import {
  DEFAULT_PARTNER_FILTERS,
  filterPartners,
  type PartnerSidebarFilters,
} from '../lib/partnerFilters';
import { PAGE_PATHS } from '../lib/routes';
import { partnerFiltersFromSearchParams } from '../lib/partnerRoutes';
import { EmptyResults } from '../components/EmptyResults';
import { ResultsSkeleton } from '../components/ResultsSkeleton';

type PartnerSortKey = 'name' | 'courses-desc' | 'courses-asc';

const PAGE_SIZE = 12;

export function PartnersPage() {
  const { navigateTo } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialFromUrl = partnerFiltersFromSearchParams(params);
  const [searchQ, setSearchQ] = useState('');
  const [toolbarCategory, setToolbarCategory] = useState(initialFromUrl.toolbarCategory);
  const [toolbarType, setToolbarType] = useState(initialFromUrl.toolbarType);
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<PartnerSortKey>('name');
  const [sidebar, setSidebar] = useState<PartnerSidebarFilters>(initialFromUrl.sidebar);
  const [filtering, setFiltering] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const next = partnerFiltersFromSearchParams(params);
    setToolbarCategory(next.toolbarCategory);
    setToolbarType(next.toolbarType);
    setSidebar(next.sidebar);
  }, [params]);

  useEffect(() => {
    setFiltering(true);
    const t = window.setTimeout(() => setFiltering(false), 220);
    return () => window.clearTimeout(t);
  }, [searchQ, toolbarCategory, toolbarType, sidebar, sort, location]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQ, toolbarCategory, toolbarType, sidebar, sort, location, params]);

  const filtered = useMemo(() => {
    const partnerId = params.get('partner');
    let list = filterPartners(PARTNERS, { searchQ, toolbarCategory, toolbarType, sidebar });
    if (partnerId) {
      list = list.filter((p) => p.id === partnerId);
    }
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'courses-desc':
          return (b.courses ?? 0) - (a.courses ?? 0);
        case 'courses-asc':
          return (a.courses ?? 0) - (b.courses ?? 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchQ, toolbarCategory, toolbarType, sidebar, sort, params]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * PAGE_SIZE;
  const pagePartners = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const goToPage = (next: number) => {
    const clamped = Math.max(1, Math.min(next, totalPages));
    setCurrentPage(clamped);
    document.getElementById('partnersResultsPanel')?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  };

  const clearFilters = () => {
    setSearchQ('');
    setToolbarCategory('all');
    setToolbarType('all');
    setLocation('');
    setSort('name');
    setSidebar(DEFAULT_PARTNER_FILTERS);
    setCurrentPage(1);
    if (params.toString()) navigate(PAGE_PATHS.partners, { replace: true });
  };

  const handleSidebarChange = (next: PartnerSidebarFilters) => {
    setSidebar(next);
    if (next.categories.length === 1) setToolbarCategory(next.categories[0]);
    else if (next.categories.length === 0) setToolbarCategory('all');
    else setToolbarCategory('all');

    if (next.types.length === 1) {
      setToolbarType(next.types[0]);
      if (toolbarCategory === 'industry') setToolbarCategory('business');
    } else if (next.types.length === 0) {
      setToolbarType('all');
    } else {
      setToolbarType('all');
    }
  };

  const gridClass = view === 'list' ? 'partners-list-view' : 'partners-grid';

  const setToolbarPartnerCategory = (category: string) => {
    setToolbarCategory(category);
    setSidebar((prev) => ({
      ...prev,
      categories: category === 'all' ? [] : [category],
      types: category === 'industry' ? [] : prev.types,
      othersSpecify: category === 'industry' ? '' : prev.othersSpecify,
    }));
    if (category === 'industry') setToolbarType('all');
  };

  const setToolbarPartnerType = (type: string) => {
    setToolbarType(type);
    setSidebar((prev) => ({
      ...prev,
      categories: prev.categories.length ? prev.categories : ['business'],
      types: type === 'all' ? [] : [type],
      othersSpecify: type === 'others' ? prev.othersSpecify : '',
    }));
    if (toolbarCategory === 'all' || toolbarCategory === 'industry') {
      setToolbarCategory('business');
    }
  };

  const businessTypeFilterDisabled = toolbarCategory === 'industry';

  return (
    <>
      <div className="partners-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => navigateTo('home')}>
              Home
            </button>
            <span className="sep">/</span>
            <span className="current" aria-current="page">
              Partners
            </span>
          </nav>
          <h1>Our Partners</h1>
          <p>
            Business partners — training centers, assessment and PDOS providers, review centers, and
            schools. Industry partners — unions, agencies, clinics, and maritime organizations.
          </p>
        </div>
      </div>

      <div className="courses-search-bar partners-search-bar">
        <div className="container">
          <div className="courses-search-inner">
            <div className="cs-input-wrap">
              <i className="bi bi-search cs-input-icon" aria-hidden />
              <input
                className="cs-input"
                type="search"
                id="partnerSearchQ"
                placeholder="Search partner name or keyword…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                aria-label="Search partners"
              />
            </div>
            <select
              className="cs-select"
              id="psCategory"
              value={toolbarCategory}
              onChange={(e) => setToolbarPartnerCategory(e.target.value)}
            >
              <option value="all">All Partners</option>
              {PARTNER_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              className="cs-select"
              id="psType"
              value={toolbarType}
              disabled={businessTypeFilterDisabled}
              aria-disabled={businessTypeFilterDisabled}
              onChange={(e) => setToolbarPartnerType(e.target.value)}
              title={businessTypeFilterDisabled ? 'Applies to business partners only' : undefined}
            >
              <option value="all">All Business Types</option>
              {PARTNER_BUSINESS_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className="cs-select"
              id="psSort"
              value={sort}
              onChange={(e) => setSort(e.target.value as PartnerSortKey)}
              style={{ minWidth: 160 }}
            >
              <option value="name">Sort: Partner Name</option>
              <option value="courses-desc">Most courses listed</option>
              <option value="courses-asc">Fewest courses listed</option>
            </select>
            <select
              className="cs-select"
              id="psLoc"
              value={location}
              onChange={(e) => {
                const val = e.target.value;
                setLocation(val);
                setSidebar((prev) => ({
                  ...prev,
                  cities: val ? [val] : [],
                }));
              }}
              style={{ minWidth: 130 }}
            >
              <option value="">All Locations</option>
              {PARTNER_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="partners-page-body">
        <div className="container">
          <div className="courses-layout partners-layout">
            <CatalogLayoutToolbar
              onClearFilters={clearFilters}
              resultsCount={
                filtered.length > 0 ? (
                  <>
                    Showing <strong>{pageStart + 1}</strong>–
                    <strong>{pageStart + pagePartners.length}</strong> of{' '}
                    <strong>{filtered.length}</strong> partners
                    {filtered.length < PARTNERS_TOTAL && (
                      <>
                        {' '}
                        (<strong>{PARTNERS_TOTAL}</strong> in catalog)
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Showing <strong>0</strong> of <strong>{PARTNERS_TOTAL}</strong> partners
                  </>
                )
              }
              viewToggle={
                <div className="view-toggle">
                  <button
                    type="button"
                    className={`view-btn${view === 'grid' ? ' active' : ''}`}
                    title="Grid view"
                    aria-pressed={view === 'grid'}
                    onClick={() => setView('grid')}
                  >
                    <i className="bi bi-grid-3x3-gap-fill" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={`view-btn${view === 'list' ? ' active' : ''}`}
                    title="List view"
                    aria-pressed={view === 'list'}
                    onClick={() => setView('list')}
                  >
                    <i className="bi bi-list-ul" aria-hidden />
                  </button>
                </div>
              }
            />

            <PartnersFilters filters={sidebar} onFiltersChange={handleSidebarChange} />

            <div
              className={`courses-results-panel${filtering ? ' is-filtering' : ''}`}
              id="partnersResultsPanel"
            >
              {!filtering && filtered.length > 0 ? (
                <div className={gridClass} id="partnersGrid">
                  {pagePartners.map((p) => (
                    <PartnerCard key={p.id} partner={p} listMode={view === 'list'} />
                  ))}
                </div>
              ) : null}

              {filtering ? (
                <ResultsSkeleton
                  variant={view === 'list' ? 'partners-list' : 'partners'}
                  count={6}
                />
              ) : null}

              {!filtering && filtered.length === 0 ? (
                <EmptyResults
                  iconClass="bi-building"
                  title="No partners match your filters"
                  description="Try clearing filters or broadening your search."
                  actionLabel="Clear all filters"
                  onAction={clearFilters}
                />
              ) : null}

              {!filtering && filtered.length > 0 ? (
                <div className="pagination">
                  <button
                    type="button"
                    className="page-btn nav-pg"
                    disabled={page <= 1}
                    aria-label="First page"
                    onClick={() => goToPage(1)}
                  >
                    <i className="bi bi-chevron-double-left" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="page-btn nav-pg"
                    disabled={page <= 1}
                    aria-label="Previous page"
                    onClick={() => goToPage(page - 1)}
                  >
                    <i className="bi bi-chevron-left" aria-hidden />
                  </button>
                  <span className="page-info">
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </span>
                  <button
                    type="button"
                    className="page-btn nav-pg"
                    disabled={page >= totalPages}
                    aria-label="Next page"
                    onClick={() => goToPage(page + 1)}
                  >
                    <i className="bi bi-chevron-right" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="page-btn nav-pg"
                    disabled={page >= totalPages}
                    aria-label="Last page"
                    onClick={() => goToPage(totalPages)}
                  >
                    <i className="bi bi-chevron-double-right" aria-hidden />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="cta-banner">
        <div className="container">
          <span className="section-eyebrow" style={{ color: 'var(--teal-200)' }}>
            Join TOBC
          </span>
          <h2 style={{ color: '#fff', marginBottom: 10 }}>Become a TOBC Partner</h2>
          <p style={{ color: 'rgba(255,255,255,.88)', margin: '0 auto 24px', maxWidth: 460 }}>
            List your training center or organization and reach 12,400+ active seafarers.
          </p>
          <button type="button" className="btn btn-primary btn--lg">
            Apply as Partner →
          </button>
        </div>
      </div>
    </>
  );
}
