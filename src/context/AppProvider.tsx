import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthModalMode, AuthUser, AppNotification, BookingState, LegalDoc, RoleId, ToastItem } from '../types';
import { getCourseById } from '../lib/courseCatalog';
import { PAGE_PATHS } from '../lib/routes';
import { fetchCurrentUser, loginAccount, logoutAccount, registerAccount } from '../lib/authApi';
import { fetchCart, fetchWishlist, saveCartApi, saveWishlistApi } from '../lib/listsApi';
import {
  clearWishlistAndCart,
  hasSeenBookingPrimer,
  loadCart,
  loadNotifications,
  loadWishlist,
  saveCart,
  saveNotifications,
  saveWishlist,
  setBookingPrimerSeen,
} from '../lib/storage';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { applyA11yPrefs, loadA11yPrefs } from '../lib/accessibility';
import { emptyBookingState, lineItemsFromCourseIds } from '../lib/booking';
import { mergeBookingContactFromUser } from '../lib/userName';
import { AUTH_ENABLED, AUTH_PAUSED_MESSAGE } from '../lib/featureFlags';
import { GUIDED_TOUR_STEPS } from '../data/guidedTour';
import { cleanupTourDom } from '../lib/tourCleanup';
import { forceUnlockBodyScroll } from '../lib/scrollLock';

/** Guest guide dismissed for this browser tab session only */
const ONBOARD_SESSION_KEY = 'tobc_guest_onboard_dismissed';

type BookingPartial = Omit<BookingState, 'open' | 'step' | 'confirmationIds'> &
  Partial<Pick<BookingState, 'step'>>;

interface AppContextValue {
  role: RoleId;
  setRole: (role: RoleId) => void;
  user: AuthUser | null;
  isLoggedIn: boolean;
  authEnabled: boolean;
  authSessionReady: boolean;
  loginWithEmail: (email: string, password: string) => Promise<string | null>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  logoutConfirmOpen: boolean;
  openLogoutConfirm: () => void;
  closeLogoutConfirm: () => void;
  confirmLogout: () => void;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  legalModal: LegalDoc | null;
  openLegalModal: (doc: LegalDoc) => void;
  closeLegalModal: () => void;
  accessibilityOpen: boolean;
  openAccessibilityPanel: () => void;
  closeAccessibilityPanel: () => void;
  navigateTo: (page: keyof typeof PAGE_PATHS) => void;
  toasts: ToastItem[];
  toast: (message: string, type?: ToastItem['type']) => void;
  dismissToast: (id: number) => void;
  booking: BookingState;
  openBooking: (partial: BookingPartial) => void;
  closeBooking: () => void;
  updateBooking: (partial: Partial<BookingState>) => void;
  updateBookingItem: (courseId: string, patch: Partial<BookingState['items'][number]>) => void;
  courseDetailId: string | null;
  openCourseDetail: (courseId: string) => void;
  closeCourseDetail: () => void;
  partnerDetailId: string | null;
  openPartnerDetail: (partnerId: string) => void;
  closePartnerDetail: () => void;
  wishlistIds: string[];
  cartIds: string[];
  addToWishlist: (courseId: string) => void;
  removeFromWishlist: (courseId: string) => void;
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  isInWishlist: (courseId: string) => boolean;
  isInCart: (courseId: string) => boolean;
  startBookNow: (courseId: string) => void;
  startCheckout: (courseIds: string[]) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  tourOpen: boolean;
  tourStepIndex: number;
  startGuidedTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  updateSessionUser: (user: AuthUser) => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  addNotification: (title: string, body: string) => void;
  markAllNotificationsRead: () => void;
  bookingPrimerOpen: boolean;
  dismissBookingPrimer: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultBooking: BookingState = {
  open: false,
  ...emptyBookingState(1),
};

function bookingFromCourseIds(courseIds: string[], step: BookingState['step'] = 1): Omit<BookingState, 'open'> {
  return {
    ...emptyBookingState(step),
    items: lineItemsFromCourseIds(courseIds),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [role, setRoleState] = useState<RoleId>('seafarer');
  const setRole = useCallback((r: RoleId) => setRoleState(r), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authSessionReady, setAuthSessionReady] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [booking, setBooking] = useState<BookingState>(defaultBooking);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [courseDetailId, setCourseDetailId] = useState<string | null>(null);
  const [partnerDetailId, setPartnerDetailId] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => loadWishlist());
  const [cartIds, setCartIds] = useState<string[]>(() => loadCart());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [legalModal, setLegalModal] = useState<LegalDoc | null>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [pendingBookCourseIds, setPendingBookCourseIds] = useState<string[]>([]);
  const [bookingPrimerOpen, setBookingPrimerOpen] = useState(false);
  const [primerPendingCourseId, setPrimerPendingCourseId] = useState<string | null>(null);

  const isLoggedIn = !!user;

  const resetGuestLists = useCallback(() => {
    setWishlistIds([]);
    setCartIds([]);
    clearWishlistAndCart();
  }, []);

  const syncListsForUser = useCallback(async (mergeLocal: boolean) => {
    if (mergeLocal) {
      const localW = loadWishlist();
      const localC = loadCart();
      const [serverW, serverC] = await Promise.all([fetchWishlist(), fetchCart()]);
      if (serverW && serverC) {
        const mergedW = [...new Set([...serverW, ...localW])];
        const mergedC = [...new Set([...serverC, ...localC])];
        await Promise.all([saveWishlistApi(mergedW), saveCartApi(mergedC)]);
        setWishlistIds(mergedW);
        setCartIds(mergedC);
        saveWishlist(mergedW);
        saveCart(mergedC);
        return;
      }
    }
    const [w, c] = await Promise.all([fetchWishlist(), fetchCart()]);
    if (w) {
      setWishlistIds(w);
      saveWishlist(w);
    }
    if (c) {
      setCartIds(c);
      saveCart(c);
    }
  }, []);

  useEffect(() => {
    applyA11yPrefs(loadA11yPrefs());
  }, []);

  useEffect(() => {
    if (!AUTH_ENABLED) {
      setAuthSessionReady(true);
      try {
        setOnboardingOpen(!sessionStorage.getItem(ONBOARD_SESSION_KEY));
      } catch {
        setOnboardingOpen(true);
      }
      return;
    }

    let cancelled = false;
    fetchCurrentUser()
      .then(async (sessionUser) => {
        if (cancelled) return;
        if (sessionUser) {
          setUser(sessionUser);
          setOnboardingOpen(false);
          await syncListsForUser(false);
          return;
        }
        setWishlistIds(loadWishlist());
        setCartIds(loadCart());
        try {
          setOnboardingOpen(!sessionStorage.getItem(ONBOARD_SESSION_KEY));
        } catch {
          setOnboardingOpen(true);
        }
      })
      .finally(() => {
        if (!cancelled) setAuthSessionReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [resetGuestLists, syncListsForUser]);

  useEffect(() => {
    const shouldLockScroll =
      onboardingOpen ||
      booking.open ||
      authModalOpen ||
      courseDetailId !== null ||
      partnerDetailId !== null ||
      legalModal !== null ||
      logoutConfirmOpen ||
      bookingPrimerOpen ||
      accessibilityOpen;
    if (shouldLockScroll) {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }
    unlockBodyScroll();
  }, [
    onboardingOpen,
    booking.open,
    authModalOpen,
    courseDetailId,
    partnerDetailId,
    legalModal,
    logoutConfirmOpen,
    bookingPrimerOpen,
    accessibilityOpen,
  ]);

  useEffect(() => {
    if (!user || !booking.open) return;
    setBooking((b) => {
      const contact = mergeBookingContactFromUser(b, user);
      if (
        contact.firstName === b.firstName &&
        contact.lastName === b.lastName &&
        contact.email === b.email
      ) {
        return b;
      }
      return { ...b, ...contact };
    });
  }, [user, booking.open]);

  const toast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigateTo = useCallback(
    (page: keyof typeof PAGE_PATHS) => {
      navigate(PAGE_PATHS[page]);
      setDrawerOpen(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [navigate],
  );

  const openBooking = useCallback(
    (partial: BookingPartial) => {
      setCourseDetailId(null);
      setPartnerDetailId(null);
      const base: BookingState = {
        ...defaultBooking,
        ...partial,
        open: true,
        step: partial.step ?? 1,
      };
      setBooking({ ...base, ...mergeBookingContactFromUser(base, user) });
    },
    [user],
  );

  const closeBooking = useCallback(() => {
    setBooking((b) => ({ ...b, open: false }));
  }, []);

  const updateBooking = useCallback((partial: Partial<BookingState>) => {
    setBooking((b) => ({ ...b, ...partial }));
  }, []);

  const updateBookingItem = useCallback(
    (courseId: string, patch: Partial<BookingState['items'][number]>) => {
      setBooking((b) => ({
        ...b,
        items: b.items.map((item) => (item.courseId === courseId ? { ...item, ...patch } : item)),
      }));
    },
    [],
  );

  const openCourseDetail = useCallback((courseId: string) => {
    setPartnerDetailId(null);
    setCourseDetailId(courseId);
  }, []);

  const closeCourseDetail = useCallback(() => {
    setCourseDetailId(null);
  }, []);

  const openPartnerDetail = useCallback((partnerId: string) => {
    setCourseDetailId(null);
    setPartnerDetailId(partnerId);
  }, []);

  const closePartnerDetail = useCallback(() => {
    setPartnerDetailId(null);
  }, []);

  const openAuthModal = useCallback(
    (mode: AuthModalMode = 'login') => {
      if (!AUTH_ENABLED) {
        toast(AUTH_PAUSED_MESSAGE, 'info');
        return;
      }
      setOnboardingOpen(false);
      try {
        sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      setAuthModalMode(mode);
      setAuthModalOpen(true);
    },
    [toast],
  );

  const addToWishlist = useCallback(
    (courseId: string) => {
      setWishlistIds((prev) => {
        if (prev.includes(courseId)) return prev;
        const next = [...prev, courseId];
        saveWishlist(next);
        if (user) void saveWishlistApi(next);
        return next;
      });
      toast('Added to wishlist', 'success');
    },
    [toast, user],
  );

  const removeFromWishlist = useCallback(
    (courseId: string) => {
      setWishlistIds((prev) => {
        const next = prev.filter((id) => id !== courseId);
        saveWishlist(next);
        if (user) void saveWishlistApi(next);
        return next;
      });
    },
    [user],
  );

  const addToCart = useCallback(
    (courseId: string) => {
      setCartIds((prev) => {
        if (prev.includes(courseId)) return prev;
        const next = [...prev, courseId];
        saveCart(next);
        if (user) void saveCartApi(next);
        return next;
      });
      toast('Added to cart', 'success');
    },
    [toast, user],
  );

  const removeFromCart = useCallback(
    (courseId: string) => {
      setCartIds((prev) => {
        const next = prev.filter((id) => id !== courseId);
        saveCart(next);
        if (user) void saveCartApi(next);
        return next;
      });
    },
    [user],
  );

  const isInWishlist = useCallback(
    (courseId: string) => wishlistIds.includes(courseId),
    [wishlistIds],
  );
  const isInCart = useCallback(
    (courseId: string) => cartIds.includes(courseId),
    [cartIds],
  );

  const openLegalModal = useCallback((doc: LegalDoc) => {
    setLegalModal(doc);
  }, []);

  const closeLegalModal = useCallback(() => {
    setLegalModal(null);
  }, []);

  const openAccessibilityPanel = useCallback(() => {
    setAccessibilityOpen(true);
  }, []);

  const closeAccessibilityPanel = useCallback(() => {
    setAccessibilityOpen(false);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setPendingBookCourseIds([]);
  }, []);

  const updateSessionUser = useCallback((authUser: AuthUser) => {
    setUser(authUser);
  }, []);

  const completeAuth = useCallback(
    (authUser: AuthUser) => {
      const pending = pendingBookCourseIds;
      setUser(authUser);
      setAuthModalOpen(false);
      setOnboardingOpen(false);
      try {
        sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      void syncListsForUser(true);
      const successMessage = pending.length
        ? 'Signed in — continuing your booking…'
        : authModalMode === 'register'
          ? 'Account created! Welcome to TOBC.'
          : 'Welcome back! You are now logged in.';
      toast(successMessage, 'success');
      setPendingBookCourseIds([]);
      if (!hasSeenBookingPrimer()) {
        setPrimerPendingCourseId(pending[0] ?? null);
        setBookingPrimerOpen(true);
        return;
      }
      if (pending.length) {
        openBooking(bookingFromCourseIds(pending, 1));
      }
    },
    [authModalMode, openBooking, pendingBookCourseIds, syncListsForUser, toast],
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const result = await loginAccount(email, password);
      if (!result.ok) return result.error;
      completeAuth(result.user);
      return null;
    },
    [completeAuth],
  );

  const registerWithEmail = useCallback(
    async (name: string, email: string, password: string): Promise<string | null> => {
      const result = await registerAccount(name, email, password);
      if (!result.ok) return result.error;
      completeAuth(result.user);
      return null;
    },
    [completeAuth],
  );

  const logout = useCallback(() => {
    void logoutAccount().finally(() => {
      setUser(null);
      resetGuestLists();
      try {
        setOnboardingOpen(!sessionStorage.getItem(ONBOARD_SESSION_KEY));
      } catch {
        setOnboardingOpen(true);
      }
      toast('Signed out', 'info');
    });
  }, [resetGuestLists, toast]);

  const openLogoutConfirm = useCallback(() => setLogoutConfirmOpen(true), []);
  const closeLogoutConfirm = useCallback(() => setLogoutConfirmOpen(false), []);
  const confirmLogout = useCallback(() => {
    setLogoutConfirmOpen(false);
    setDrawerOpen(false);
    logout();
  }, [logout]);

  const dismissBookingPrimer = useCallback(() => {
    setBookingPrimerSeen();
    const ids =
      pendingBookCourseIds.length > 0
        ? pendingBookCourseIds
        : primerPendingCourseId
          ? [primerPendingCourseId]
          : [];
    setBookingPrimerOpen(false);
    setPrimerPendingCourseId(null);
    setPendingBookCourseIds([]);
    if (ids.length) {
      openBooking(bookingFromCourseIds(ids, 1));
    }
  }, [openBooking, pendingBookCourseIds, primerPendingCourseId]);

  const beginBooking = useCallback(
    (courseIds: string[]) => {
      const ids = [...new Set(courseIds)].filter((id) => getCourseById(id));
      if (ids.length === 0) {
        toast('No valid courses to book', 'error');
        return;
      }
      setCourseDetailId(null);
      if (!hasSeenBookingPrimer()) {
        setPrimerPendingCourseId(ids[0] ?? null);
        setBookingPrimerOpen(true);
        setPendingBookCourseIds(ids);
        return;
      }
      openBooking(bookingFromCourseIds(ids, 1));
    },
    [openBooking, toast],
  );

  const startBookNow = useCallback(
    (courseId: string) => {
      beginBooking([courseId]);
    },
    [beginBooking],
  );

  const startCheckout = useCallback(
    (courseIds: string[]) => {
      beginBooking(courseIds);
    },
    [beginBooking],
  );

  const addNotification = useCallback((title: string, body: string) => {
    const item: AppNotification = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => {
      const next = [item, ...prev].slice(0, 40);
      saveNotifications(next);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(next);
      return next;
    });
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const dismissOnboardingSession = useCallback(() => {
    try {
      sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    dismissOnboardingSession();
    forceUnlockBodyScroll();
    setOnboardingOpen(false);
  }, [dismissOnboardingSession]);

  const skipOnboarding = completeOnboarding;

  const endTour = useCallback(() => {
    dismissOnboardingSession();
    cleanupTourDom();
    setTourOpen(false);
    setTourStepIndex(0);
  }, [dismissOnboardingSession]);

  const startGuidedTour = useCallback(() => {
    cleanupTourDom();
    setOnboardingOpen(false);
    setCourseDetailId(null);
    setPartnerDetailId(null);
    setTourStepIndex(0);
    setTourOpen(true);
    navigate(PAGE_PATHS.home);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [navigate]);

  const nextTourStep = useCallback(() => {
    setTourStepIndex((i) => Math.min(i + 1, GUIDED_TOUR_STEPS.length - 1));
  }, []);

  const prevTourStep = useCallback(() => {
    setTourStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const value = useMemo(
    () => ({
      role,
      setRole,
      user,
      isLoggedIn,
      authEnabled: AUTH_ENABLED,
      authSessionReady,
      loginWithEmail,
      registerWithEmail,
      logout,
      logoutConfirmOpen,
      openLogoutConfirm,
      closeLogoutConfirm,
      confirmLogout,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      authModalOpen,
      legalModal,
      openLegalModal,
      closeLegalModal,
      accessibilityOpen,
      openAccessibilityPanel,
      closeAccessibilityPanel,
      navigateTo,
      toasts,
      toast,
      dismissToast,
      booking,
      openBooking,
      closeBooking,
      updateBooking,
      updateBookingItem,
      courseDetailId,
      openCourseDetail,
      closeCourseDetail,
      partnerDetailId,
      openPartnerDetail,
      closePartnerDetail,
      wishlistIds,
      cartIds,
      addToWishlist,
      removeFromWishlist,
      addToCart,
      removeFromCart,
      isInWishlist,
      isInCart,
      startBookNow,
      startCheckout,
      drawerOpen,
      setDrawerOpen,
      helpOpen,
      setHelpOpen,
      onboardingOpen,
      completeOnboarding,
      skipOnboarding,
      tourOpen,
      tourStepIndex,
      startGuidedTour,
      nextTourStep,
      prevTourStep,
      endTour,
      updateSessionUser,
      notifications,
      unreadNotificationCount,
      addNotification,
      markAllNotificationsRead,
      bookingPrimerOpen,
      dismissBookingPrimer,
    }),
    [
      role,
      user,
      isLoggedIn,
      AUTH_ENABLED,
      authSessionReady,
      loginWithEmail,
      registerWithEmail,
      logout,
      logoutConfirmOpen,
      openLogoutConfirm,
      closeLogoutConfirm,
      confirmLogout,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      authModalOpen,
      legalModal,
      openLegalModal,
      closeLegalModal,
      accessibilityOpen,
      openAccessibilityPanel,
      closeAccessibilityPanel,
      navigateTo,
      toasts,
      toast,
      dismissToast,
      booking,
      openBooking,
      closeBooking,
      updateBooking,
      updateBookingItem,
      courseDetailId,
      openCourseDetail,
      closeCourseDetail,
      partnerDetailId,
      openPartnerDetail,
      closePartnerDetail,
      wishlistIds,
      cartIds,
      addToWishlist,
      removeFromWishlist,
      addToCart,
      removeFromCart,
      isInWishlist,
      isInCart,
      startBookNow,
      startCheckout,
      drawerOpen,
      helpOpen,
      onboardingOpen,
      completeOnboarding,
      skipOnboarding,
      tourOpen,
      tourStepIndex,
      startGuidedTour,
      nextTourStep,
      prevTourStep,
      endTour,
      updateSessionUser,
      notifications,
      unreadNotificationCount,
      addNotification,
      markAllNotificationsRead,
      bookingPrimerOpen,
      dismissBookingPrimer,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
