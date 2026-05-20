import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { CourseCard } from '../components/CourseCard';
import { CoursesFilters } from '../components/courses/CoursesFilters';
import { COURSES, COURSES_TOTAL } from '../data/courses';
import {
  DEFAULT_SIDEBAR_FILTERS,
  filterCourses,
  type SidebarFilters,
} from '../lib/courseFilters';

type SortKey = 'name' | 'price-asc' | 'price-desc' | 'duration';

const PAGE_SIZE = 6;

function normalizeFilter(param: string | null): string {
  if (!param) return '';
  const map: Record<string, string> = {
    stcw: 'stcw',
    'non-stcw': 'non-stcw',
    assessment: 'assessment',
    tesda: 'tesda',
    offshore: 'offshore',
  };
  return map[param.toLowerCase()] ?? param.toLowerCase();
}

export function CoursesPage() {
  const { navigateTo, toast } = useApp();
  const [params] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQ, setSearchQ] = useState(() => params.get('q') ?? '');
  const [category, setCategory] = useState(() => normalizeFilter(params.get('filter')));
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [sidebar, setSidebar] = useState<SidebarFilters>(DEFAULT_SIDEBAR_FILTERS);
  const [filtering, setFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const q = params.get('q') ?? '';
    const filter = normalizeFilter(params.get('filter'));
    setSearchQ(q);
    setCategory(filter);
    if (filter) {
      setSidebar((prev) => ({
        ...prev,
        categories: prev.categories.length ? prev.categories : [filter],
      }));
    }
  }, [params]);

  useEffect(() => {
    setFiltering(true);
    const t = window.setTimeout(() => setFiltering(false), 220);
    return () => window.clearTimeout(t);
  }, [searchQ, category, location, sort, sidebar]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQ, category, location, sort, sidebar]);

  const filtered = useMemo(() => {
    let list = filterCourses(COURSES, {
      searchQ,
      toolbarCategory: category,
      toolbarLocation: location,
      sidebar,
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.priceNum - b.priceNum;
        case 'price-desc':
          return b.priceNum - a.priceNum;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return list;
  }, [searchQ, category, location, sort, sidebar]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageCourses = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const goToPage = (next: number) => {
    const clamped = Math.max(1, Math.min(next, totalPages));
    setCurrentPage(clamped);
    document.getElementById('coursesResultsPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearFilters = () => {
    setSearchQ('');
    setCategory('');
    setLocation('');
    setSort('name');
    setSidebar(DEFAULT_SIDEBAR_FILTERS);
    setCurrentPage(1);
    toast('All filters cleared', 'info');
  };

  const handleSidebarChange = (next: SidebarFilters) => {
    setSidebar(next);
    if (next.categories.length === 1) {
      setCategory(next.categories[0]);
    } else if (next.categories.length === 0) {
      setCategory('');
    } else {
      setCategory('');
    }
  };

  const gridClass = view === 'list' ? 'courses-list-view' : 'courses-grid-view';

  return (
    <>
      <div className="courses-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => navigateTo('home')}>
              Home
            </button>
            <span className="sep">/</span>
            <span className="current" aria-current="page">
              Courses
            </span>
          </nav>
          <h1>Maritime Training Courses</h1>
          <p>
            Browse 320+ MARINA-accredited STCW, Non-STCW, Assessment, and TESDA courses across the
            Philippines.
          </p>
        </div>
      </div>

      <div className="courses-search-bar">
        <div className="container">
          <div className="courses-search-inner">
            <div className="cs-input-wrap">
              <i className="bi bi-search cs-input-icon" aria-hidden />
              <input
                className="cs-input"
                type="text"
                id="courseSearchQ"
                placeholder="Search course name or keyword…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <select
              className="cs-select"
              id="csCat"
              value={category}
              onChange={(e) => {
                const val = e.target.value;
                setCategory(val);
                setSidebar((prev) => ({
                  ...prev,
                  categories: val ? [val] : [],
                }));
              }}
            >
              <option value="">All Categories</option>
              <option value="stcw">STCW</option>
              <option value="non-stcw">Non-STCW</option>
              <option value="assessment">Assessment</option>
              <option value="tesda">TESDA</option>
              <option value="offshore">Offshore</option>
            </select>
            <select
              className="cs-select"
              id="csSort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={{ minWidth: 160 }}
            >
              <option value="name">Sort: Course Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
            <select
              className="cs-select"
              id="csLoc"
              value={location}
              onChange={(e) => {
                const val = e.target.value;
                setLocation(val);
                setSidebar((prev) => ({
                  ...prev,
                  locations: val ? [val === 'manila' ? 'metro-manila' : val] : [],
                }));
              }}
              style={{ minWidth: 130 }}
            >
              <option value="">All Locations</option>
              <option value="manila">Manila</option>
              <option value="cebu">Cebu City</option>
              <option value="pasay">Pasay</option>
              <option value="cavite">Cavite</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="courses-layout">
          <CoursesFilters filters={sidebar} onFiltersChange={handleSidebarChange} onClear={clearFilters} />

          <div
            className={`courses-results-panel${filtering ? ' is-filtering' : ''}`}
            id="coursesResultsPanel"
          >
            <div className="results-header">
              <div className="results-count">
                {filtered.length > 0 ? (
                  <>
                    Showing <strong id="resultCount">{pageStart + 1}</strong>–
                    <strong>{pageStart + pageCourses.length}</strong> of{' '}
                    <strong>{filtered.length}</strong> results
                    {filtered.length < COURSES_TOTAL && (
                      <>
                        {' '}
                        (<strong>{COURSES_TOTAL}</strong> in catalog)
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Showing <strong id="resultCount">0</strong> of{' '}
                    <strong>{COURSES_TOTAL}</strong> courses
                  </>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="view-toggle">
                  <button
                    type="button"
                    className={`view-btn${view === 'grid' ? ' active' : ''}`}
                    id="gridViewBtn"
                    title="Grid view"
                    aria-pressed={view === 'grid'}
                    onClick={() => setView('grid')}
                  >
                    <i className="bi bi-grid-3x3-gap-fill" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={`view-btn${view === 'list' ? ' active' : ''}`}
                    id="listViewBtn"
                    title="List view"
                    aria-pressed={view === 'list'}
                    onClick={() => setView('list')}
                  >
                    <i className="bi bi-list-ul" aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            <div className={gridClass} id="coursesGrid">
              {pageCourses.map((c) => (
                <CourseCard key={c.id} course={c} listMode={view === 'list'} />
              ))}
            </div>

            <div
              className="no-results"
              id="noResults"
              style={{ display: filtered.length === 0 ? 'block' : 'none' }}
            >
              <div className="icon">
                <i className="bi bi-search" aria-hidden />
              </div>
              <h3>No courses found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={clearFilters}>
                Clear Filters
              </button>
            </div>

            {filtered.length > 0 && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
