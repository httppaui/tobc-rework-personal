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
import { loadCart, loadNotifications, loadWishlist, saveCart, saveNotifications, saveWishlist } from '../lib/storage';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { applyA11yPrefs, loadA11yPrefs } from '../lib/accessibility';

/** Guest guide dismissed for this browser tab session only */
const ONBOARD_SESSION_KEY = 'tobc_guest_onboard_dismissed';

type BookingPartial = Omit<BookingState, 'open' | 'step' | 'confirmationId'> &
  Partial<Pick<BookingState, 'step'>>;

interface AppContextValue {
  role: RoleId;
  setRole: (role: RoleId) => void;
  user: AuthUser | null;
  isLoggedIn: boolean;
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
  courseDetailId: string | null;
  openCourseDetail: (courseId: string) => void;
  closeCourseDetail: () => void;
  wishlistIds: string[];
  cartIds: string[];
  addToWishlist: (courseId: string) => void;
  removeFromWishlist: (courseId: string) => void;
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  isInWishlist: (courseId: string) => boolean;
  isInCart: (courseId: string) => boolean;
  startBookNow: (courseId: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  updateSessionUser: (user: AuthUser) => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  addNotification: (title: string, body: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultBooking: BookingState = {
  open: false,
  courseId: '',
  course: '',
  price: '',
  provider: '',
  location: '',
  dates: '',
  duration: '',
  category: '',
  step: 1,
  scheduleDate: '',
  scheduleTime: '',
  firstName: '',
  lastName: '',
  srb: '',
  mobile: '',
  email: '',
  paymentProofName: '',
  paymentProofDataUrl: '',
  confirmationId: '',
};

function bookingFromCourseId(courseId: string, step: BookingState['step'] = 1): Omit<BookingState, 'open'> {
  const c = getCourseById(courseId);
  if (!c) {
    return { ...defaultBooking, step, courseId };
  }
  return {
    ...defaultBooking,
    courseId: c.id,
    course: c.title,
    price: c.price,
    provider: c.provider,
    location: c.location,
    dates: c.dates,
    duration: c.duration,
    category: c.category,
    step,
    scheduleDate: '',
    scheduleTime: '',
    paymentProofName: '',
    paymentProofDataUrl: '',
    confirmationId: '',
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
  const [courseDetailId, setCourseDetailId] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => loadWishlist());
  const [cartIds, setCartIds] = useState<string[]>(() => loadCart());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [legalModal, setLegalModal] = useState<LegalDoc | null>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [pendingBookCourseId, setPendingBookCourseId] = useState<string | null>(null);

  const isLoggedIn = !!user;

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
  }, []);

  useEffect(() => {
    const shouldLockScroll =
      onboardingOpen ||
      booking.open ||
      authModalOpen ||
      courseDetailId !== null ||
      legalModal !== null ||
      logoutConfirmOpen ||
      accessibilityOpen;
    if (shouldLockScroll) {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }
    unlockBodyScroll();
  }, [onboardingOpen, booking.open, authModalOpen, courseDetailId, legalModal, logoutConfirmOpen, accessibilityOpen]);

  useEffect(() => {
    if (user?.email) {
      setBooking((b) => (b.email ? b : { ...b, email: user.email, firstName: b.firstName || user.name.split(' ')[0] || '' }));
    }
  }, [user]);

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

  const openBooking = useCallback((partial: BookingPartial) => {
    setCourseDetailId(null);
    setBooking({
      ...defaultBooking,
      ...partial,
      open: true,
      step: partial.step ?? 1,
    });
  }, []);

  const closeBooking = useCallback(() => {
    setBooking((b) => ({ ...b, open: false }));
  }, []);

  const updateBooking = useCallback((partial: Partial<BookingState>) => {
    setBooking((b) => ({ ...b, ...partial }));
  }, []);

  const openCourseDetail = useCallback((courseId: string) => {
    setCourseDetailId(courseId);
  }, []);

  const closeCourseDetail = useCallback(() => {
    setCourseDetailId(null);
  }, []);

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

  const isInWishlist = useCallback((courseId: string) => wishlistIds.includes(courseId), [wishlistIds]);
  const isInCart = useCallback((courseId: string) => cartIds.includes(courseId), [cartIds]);

  const openAuthModal = useCallback((mode: AuthModalMode = 'login') => {
    setOnboardingOpen(false);
    try {
      sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

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
    setPendingBookCourseId(null);
  }, []);

  const updateSessionUser = useCallback((authUser: AuthUser) => {
    setUser(authUser);
  }, []);

  const completeAuth = useCallback(
    (authUser: AuthUser) => {
      setUser(authUser);
      setAuthModalOpen(false);
      setOnboardingOpen(false);
      try {
        sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      void syncListsForUser(true);
      const pending = pendingBookCourseId;
      const successMessage = pending
        ? 'Signed in — continuing your booking…'
        : authModalMode === 'register'
          ? 'Account created! Welcome to TOBC.'
          : 'Welcome back! You are now logged in.';
      toast(successMessage, 'success');
      setPendingBookCourseId(null);
      if (pending) {
        openBooking(bookingFromCourseId(pending, 1));
      }
    },
    [authModalMode, openBooking, pendingBookCourseId, syncListsForUser, toast],
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
      try {
        setOnboardingOpen(!sessionStorage.getItem(ONBOARD_SESSION_KEY));
      } catch {
        setOnboardingOpen(true);
      }
      toast('Signed out', 'info');
    });
  }, [toast]);

  const openLogoutConfirm = useCallback(() => setLogoutConfirmOpen(true), []);
  const closeLogoutConfirm = useCallback(() => setLogoutConfirmOpen(false), []);
  const confirmLogout = useCallback(() => {
    setLogoutConfirmOpen(false);
    setDrawerOpen(false);
    logout();
  }, [logout]);

  const startBookNow = useCallback(
    (courseId: string) => {
      setCourseDetailId(null);
      if (!user) {
        setOnboardingOpen(false);
        try {
          sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
        } catch {
          /* ignore */
        }
        setPendingBookCourseId(courseId);
        setAuthModalMode('book');
        setAuthModalOpen(true);
        return;
      }
      openBooking(bookingFromCourseId(courseId, 1));
    },
    [openBooking, user],
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

  const completeOnboarding = useCallback(() => {
    try {
      sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setOnboardingOpen(false);
  }, []);

  const skipOnboarding = completeOnboarding;

  const value = useMemo(
    () => ({
      role,
      setRole,
      user,
      isLoggedIn,
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
      courseDetailId,
      openCourseDetail,
      closeCourseDetail,
      wishlistIds,
      cartIds,
      addToWishlist,
      removeFromWishlist,
      addToCart,
      removeFromCart,
      isInWishlist,
      isInCart,
      startBookNow,
      drawerOpen,
      setDrawerOpen,
      helpOpen,
      setHelpOpen,
      onboardingOpen,
      completeOnboarding,
      skipOnboarding,
      updateSessionUser,
      notifications,
      unreadNotificationCount,
      addNotification,
      markAllNotificationsRead,
    }),
    [
      role,
      user,
      isLoggedIn,
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
      courseDetailId,
      openCourseDetail,
      closeCourseDetail,
      wishlistIds,
      cartIds,
      addToWishlist,
      removeFromWishlist,
      addToCart,
      removeFromCart,
      isInWishlist,
      isInCart,
      startBookNow,
      drawerOpen,
      helpOpen,
      onboardingOpen,
      completeOnboarding,
      skipOnboarding,
      updateSessionUser,
      notifications,
      unreadNotificationCount,
      addNotification,
      markAllNotificationsRead,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
