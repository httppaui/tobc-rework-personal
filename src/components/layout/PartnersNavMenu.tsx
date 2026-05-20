import { useEffect, useState } from 'react';
import { PAGE_PATHS } from '../../lib/routes';
import { INDUSTRY_PARTNERS_NAV, PARTNER_BUSINESS_NAV, partnerNavLabel } from '../../data/partnersNav';
import { NavDropdownItem } from './NavDropdown';

type PartnersNavMenuProps = {
  onNavigate: (path: string) => void;
  menuOpen: boolean;
};

export function PartnersNavMenu({ onNavigate, menuOpen }: PartnersNavMenuProps) {
  const [activeSection, setActiveSection] = useState<'business' | 'industry'>('business');

  useEffect(() => {
    if (menuOpen) setActiveSection('business');
  }, [menuOpen]);

  return (
    <div className="nav-dropdown-partners nav-dropdown-partners--mega">
      <div className="nav-dropdown-mega-sidebar" role="presentation">
        <button
          type="button"
          className={`nav-dropdown-mega-tab${activeSection === 'business' ? ' is-active' : ''}`}
          aria-pressed={activeSection === 'business'}
          onMouseEnter={() => setActiveSection('business')}
          onFocus={() => setActiveSection('business')}
          onClick={() => setActiveSection('business')}
        >
          Business Partners
          <i className="bi bi-chevron-right nav-dropdown-mega-tab-ico" aria-hidden />
        </button>
        <button
          type="button"
          className={`nav-dropdown-mega-tab${activeSection === 'industry' ? ' is-active' : ''}`}
          aria-pressed={activeSection === 'industry'}
          onMouseEnter={() => setActiveSection('industry')}
          onFocus={() => setActiveSection('industry')}
          onClick={() => setActiveSection('industry')}
        >
          Industry Partners
          <i className="bi bi-chevron-right nav-dropdown-mega-tab-ico" aria-hidden />
        </button>
      </div>
      <div
        className="nav-dropdown-mega-panel"
        role="menu"
        aria-label={activeSection === 'business' ? 'Business partner types' : 'Industry partners'}
      >
        {activeSection === 'business'
          ? PARTNER_BUSINESS_NAV.map((item) => (
              <NavDropdownItem
                key={item.type}
                label={item.label}
                onSelect={() =>
                  onNavigate(`${PAGE_PATHS.partners}?category=business&type=${item.type}`)
                }
              />
            ))
          : INDUSTRY_PARTNERS_NAV.map((partner) => (
              <NavDropdownItem
                key={partner.id}
                label={partnerNavLabel(partner)}
                onSelect={() =>
                  onNavigate(`${PAGE_PATHS.partners}?category=industry&partner=${partner.id}`)
                }
              />
            ))}
      </div>
    </div>
  );
}
