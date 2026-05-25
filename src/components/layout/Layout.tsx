import { Outlet, useLocation } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { Footer } from './Footer';
import { MobileDrawer } from './MobileDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { AuthModal } from '../AuthModal';
import { LegalModal } from '../LegalModal';
import { AccessibilityModal } from '../AccessibilityModal';
import { LogoutConfirmModal } from '../LogoutConfirmModal';
import { BookingFlowPrimerModal } from '../BookingFlowPrimerModal';
import { BookingModal } from '../BookingModal';
import { CourseDetailModal } from '../CourseDetailModal';
import { PartnerDetailModal } from '../PartnerDetailModal';
import { Onboarding } from '../Onboarding';
import { GuidedTour } from '../GuidedTour';
import { ToastStack } from '../ToastStack';
import { HelpFab } from '../HelpFab';
import { useApp } from '../../context/AppProvider';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export function Layout() {
  const {
    closeBooking,
    closeCourseDetail,
    closePartnerDetail,
    closeAuthModal,
    closeLegalModal,
    closeAccessibilityPanel,
    closeLogoutConfirm,
    dismissBookingPrimer,
    drawerOpen,
    setDrawerOpen,
    helpOpen,
    setHelpOpen,
    onboardingOpen,
    skipOnboarding,
    tourOpen,
    endTour,
  } = useApp();
  const location = useLocation();

  useEscapeKey([
    () => {
      if (onboardingOpen) skipOnboarding();
    },
    () => {
      if (tourOpen) endTour();
    },
    closeBooking,
    closeCourseDetail,
    closePartnerDetail,
    closeAuthModal,
    closeLegalModal,
    closeAccessibilityPanel,
    closeLogoutConfirm,
    dismissBookingPrimer,
    () => setDrawerOpen(false),
    () => setHelpOpen(false),
  ]);

  return (
    <>
      <SiteHeader />
      <main key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <MobileDrawer />
      <CourseDetailModal />
      <PartnerDetailModal />
      <AuthModal />
      <LegalModal />
      <AccessibilityModal />
      <LogoutConfirmModal />
      <BookingFlowPrimerModal />
      <BookingModal />
      <Onboarding />
      <GuidedTour />
      <ToastStack />
      <HelpFab />
      {(drawerOpen || helpOpen || onboardingOpen) && null}
    </>
  );
}
