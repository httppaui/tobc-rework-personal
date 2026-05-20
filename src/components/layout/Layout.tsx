import { Outlet, useLocation } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { Footer } from './Footer';
import { MobileDrawer } from './MobileDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { AuthModal } from '../AuthModal';
import { LegalModal } from '../LegalModal';
import { AccessibilityModal } from '../AccessibilityModal';
import { LogoutConfirmModal } from '../LogoutConfirmModal';
import { BookingModal } from '../BookingModal';
import { CourseDetailModal } from '../CourseDetailModal';
import { Onboarding } from '../Onboarding';
import { ToastStack } from '../ToastStack';
import { HelpFab } from '../HelpFab';
import { useApp } from '../../context/AppProvider';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export function Layout() {
  const {
    closeBooking,
    closeCourseDetail,
    closeAuthModal,
    closeLegalModal,
    closeAccessibilityPanel,
    closeLogoutConfirm,
    drawerOpen,
    setDrawerOpen,
    helpOpen,
    setHelpOpen,
    onboardingOpen,
    skipOnboarding,
  } = useApp();
  const location = useLocation();

  useEscapeKey([
    () => {
      if (onboardingOpen) skipOnboarding();
    },
    closeBooking,
    closeCourseDetail,
    closeAuthModal,
    closeLegalModal,
    closeAccessibilityPanel,
    closeLogoutConfirm,
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
      <AuthModal />
      <LegalModal />
      <AccessibilityModal />
      <LogoutConfirmModal />
      <BookingModal />
      <Onboarding />
      <ToastStack />
      <HelpFab />
      {(drawerOpen || helpOpen || onboardingOpen) && null}
    </>
  );
}
