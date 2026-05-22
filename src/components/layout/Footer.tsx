import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';
import { partnersUrl } from '../../lib/partnerRoutes';

export function Footer() {
  const navigate = useNavigate();
  const { navigateTo, openAuthModal, openLegalModal } = useApp();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <button
              type="button"
              className="footer-logo-wrap"
              onClick={() => navigateTo('home')}
              aria-label="TOBC home"
            >
              <img
                src="/tobc-logo-footer.png"
                alt="TOBC — The Online Booking Corp."
                className="footer-logo-img"
                width={280}
                height={96}
                decoding="async"
              />
            </button>
            <p className="footer-tagline">
              The Online Booking Corp. — Connecting Filipino seafarers, manning agencies, and MARINA-accredited
              training centers since 2022.
            </p>
            <div className="footer-contact">
              Unit 502, 5th Floor, Rufino Building
              <br />
              6784 Ayala Ave., Makati City, Philippines
              <br />
              <a href="mailto:admin@theonlinebookingcorp.com">admin@theonlinebookingcorp.com</a>
              <br />
              +63 917 878 0320 / +63 2 53104815
            </div>
            <div className="footer-social">
              <a className="footer-soc-btn" href="#" aria-label="Facebook" onClick={(e) => e.preventDefault()}>
                <i className="bi bi-facebook" aria-hidden />
              </a>
              <a className="footer-soc-btn" href="#" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
                <i className="bi bi-instagram" aria-hidden />
              </a>
              <a className="footer-soc-btn" href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>
                <i className="bi bi-linkedin" aria-hidden />
              </a>
              <a className="footer-soc-btn" href="#" aria-label="TikTok" onClick={(e) => e.preventDefault()}>
                <i className="bi bi-tiktok" aria-hidden />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>For Seafarers</h4>
            <button type="button" onClick={() => navigateTo('courses')}>
              Browse Courses
            </button>
            <button type="button" onClick={() => navigateTo('bookings')}>
              My Bookings
            </button>
            <button type="button" disabled title="Coming soon">
              My Certificates
            </button>
            <button type="button" onClick={() => openAuthModal('register')}>
              Create Account
            </button>
          </div>
          <div className="footer-col">
            <h4>Partners</h4>
            <button type="button" onClick={() => navigate(partnersUrl({ category: 'business' }))}>
              Business Partners
            </button>
            <button type="button" onClick={() => navigate(partnersUrl({ category: 'industry' }))}>
              Industry Partners
            </button>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <button type="button" onClick={() => openLegalModal('terms')}>
              Terms of Use
            </button>
            <button type="button" onClick={() => openLegalModal('privacy')}>
              Privacy Policy
            </button>
            <button type="button" onClick={() => openLegalModal('cookie')}>
              Cookie Policy
            </button>
            <button type="button" onClick={() => openLegalModal('disclaimer')}>
              Disclaimer
            </button>
            <button type="button" onClick={() => openLegalModal('refund')}>
              Refund Policy
            </button>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <button type="button" onClick={() => navigateTo('about')}>
              About Us
            </button>
            <button type="button" onClick={() => navigateTo('library')}>
              Library
            </button>
            <button type="button" onClick={() => navigateTo('news')}>
              News & Updates
            </button>
            <button type="button" onClick={() => openLegalModal('careers')}>
              Careers
            </button>
            <button type="button" onClick={() => navigateTo('help')}>
              Help Center
            </button>
            <button
              type="button"
              onClick={() => navigate(`${PAGE_PATHS.help}#help-contact`)}
            >
              Contact Us
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} The Online Booking Corp. All rights reserved.</div>
          <div className="accred-row">
            <div className="accred-chip">MARINA Registered</div>
            <div className="accred-chip">STCW Compliant</div>
            <div className="accred-chip">PCI DSS Secure</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
