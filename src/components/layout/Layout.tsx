import { Outlet, useLocation } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { Footer } from './Footer';
import { MobileDrawer } from './MobileDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { AuthModal } from '../AuthModal';
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
      <BookingModal />
      <Onboarding />
      <ToastStack />
      <HelpFab />
      {(drawerOpen || helpOpen || onboardingOpen) && null}
    </>
  );
}
