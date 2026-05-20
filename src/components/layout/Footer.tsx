import { useApp } from '../../context/AppProvider';

export function Footer() {
  const { navigateTo, openAuthModal, toast } = useApp();

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
              <a className="footer-soc-btn" href="#" aria-label="Facebook">
                <i className="bi bi-facebook" aria-hidden />
              </a>
              <a className="footer-soc-btn" href="#" aria-label="Instagram">
                <i className="bi bi-instagram" aria-hidden />
              </a>
              <a className="footer-soc-btn" href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin" aria-hidden />
              </a>
              <a className="footer-soc-btn" href="#" aria-label="TikTok">
                <i className="bi bi-tiktok" aria-hidden />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>For Seafarers</h4>
            <button type="button" onClick={() => navigateTo('courses')}>
              Browse Courses
            </button>
            <button type="button" onClick={() => toast('Opening My Bookings…', 'info')}>
              My Bookings
            </button>
            <button type="button" onClick={() => toast('Opening Certificates…', 'info')}>
              My Certificates
            </button>
            <button type="button" onClick={() => openAuthModal('register')}>
              Create Account
            </button>
          </div>
          <div className="footer-col">
            <h4>Business Partners</h4>
            <button type="button" onClick={() => navigateTo('partners')}>
              Training Centers
            </button>
            <button type="button" onClick={() => navigateTo('partners')}>
              Assessment Centers
            </button>
            <button type="button" onClick={() => navigateTo('partners')}>
              PDOS Providers
            </button>
            <button type="button" onClick={() => navigateTo('partners')}>
              Review Centers
            </button>
            <button type="button" onClick={() => navigateTo('partners')}>
              Schools
            </button>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Disclaimer</a>
            <a href="#">Refund Policy</a>
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
            <a href="#">Careers</a>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
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
