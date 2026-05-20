import { PAGE_PATHS } from '../../lib/routes';
import { INDUSTRY_PARTNERS_NAV, PARTNER_BUSINESS_NAV, partnerNavLabel } from '../../data/partnersNav';
import { NavDropdownItem } from './NavDropdown';

type PartnersNavMenuProps = {
  onNavigate: (path: string) => void;
};

export function PartnersNavMenu({ onNavigate }: PartnersNavMenuProps) {
  return (
    <div className="nav-dropdown-partners">
      <div className="nav-dropdown-branch">
        <span className="nav-dropdown-branch-label">
          Business Partners
          <i className="bi bi-chevron-right" aria-hidden />
        </span>
        <div className="nav-dropdown-submenu" role="menu" aria-label="Business partners">
          {PARTNER_BUSINESS_NAV.map((item) => (
            <NavDropdownItem
              key={item.type}
              label={item.label}
              onSelect={() =>
                onNavigate(`${PAGE_PATHS.partners}?category=business&type=${item.type}`)
              }
            />
          ))}
        </div>
      </div>
      <div className="nav-dropdown-branch">
        <span className="nav-dropdown-branch-label">
          Industry Partners
          <i className="bi bi-chevron-right" aria-hidden />
        </span>
        <div className="nav-dropdown-submenu" role="menu" aria-label="Industry partners">
          {INDUSTRY_PARTNERS_NAV.map((partner) => (
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
    </div>
  );
}
