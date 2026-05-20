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
import type { AuthModalMode, AuthUser, BookingState, RoleId, ToastItem } from '../types';
import { getCourseById } from '../lib/courseCatalog';
import { PAGE_PATHS } from '../lib/routes';
import { fetchCurrentUser, loginAccount, logoutAccount, registerAccount } from '../lib/authApi';
import { loadCart, loadWishlist, saveCart, saveWishlist } from '../lib/storage';

/** Guest guide dismissed for this browser tab session only */
const ONBOARD_SESSION_KEY = 'tobc_guest_onboard_dismissed';

type BookingPartial = Omit<BookingState, 'open' | 'step' | 'confirmationId'> &
  Partial<Pick<BookingState, 'step'>>;

interface AppContextValue {
  role: RoleId;
  setRole: (role: RoleId) => void;
  user: AuthUser | null;
  isLoggedIn: boolean;
  loginWithEmail: (email: string, password: string) => Promise<string | null>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
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
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [booking, setBooking] = useState<BookingState>(defaultBooking);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [courseDetailId, setCourseDetailId] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => loadWishlist());
  const [cartIds, setCartIds] = useState<string[]>(() => loadCart());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [pendingBookCourseId, setPendingBookCourseId] = useState<string | null>(null);

  const isLoggedIn = !!user;

  useEffect(() => {
    let cancelled = false;
    fetchCurrentUser().then((sessionUser) => {
      if (cancelled) return;
      if (sessionUser) {
        setUser(sessionUser);
        setOnboardingOpen(false);
        return;
      }
      try {
        setOnboardingOpen(!sessionStorage.getItem(ONBOARD_SESSION_KEY));
      } catch {
        setOnboardingOpen(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (onboardingOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!booking.open && !authModalOpen && !courseDetailId) {
      document.body.style.overflow = '';
    }
  }, [onboardingOpen, booking.open, authModalOpen, courseDetailId]);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    document.body.style.overflow = 'hidden';
  }, []);

  const closeBooking = useCallback(() => {
    setBooking((b) => ({ ...b, open: false }));
    document.body.style.overflow = '';
  }, []);

  const updateBooking = useCallback((partial: Partial<BookingState>) => {
    setBooking((b) => ({ ...b, ...partial }));
  }, []);

  const openCourseDetail = useCallback((courseId: string) => {
    setCourseDetailId(courseId);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCourseDetail = useCallback(() => {
    setCourseDetailId(null);
    if (!booking.open && !authModalOpen) document.body.style.overflow = '';
  }, [authModalOpen, booking.open]);

  const addToWishlist = useCallback(
    (courseId: string) => {
      setWishlistIds((prev) => {
        if (prev.includes(courseId)) return prev;
        const next = [...prev, courseId];
        saveWishlist(next);
        return next;
      });
      toast('Added to wishlist', 'success');
    },
    [toast],
  );

  const removeFromWishlist = useCallback((courseId: string) => {
    setWishlistIds((prev) => {
      const next = prev.filter((id) => id !== courseId);
      saveWishlist(next);
      return next;
    });
  }, []);

  const addToCart = useCallback(
    (courseId: string) => {
      setCartIds((prev) => {
        if (prev.includes(courseId)) return prev;
        const next = [...prev, courseId];
        saveCart(next);
        return next;
      });
      toast('Added to cart', 'success');
    },
    [toast],
  );

  const removeFromCart = useCallback((courseId: string) => {
    setCartIds((prev) => {
      const next = prev.filter((id) => id !== courseId);
      saveCart(next);
      return next;
    });
  }, []);

  const isInWishlist = useCallback((courseId: string) => wishlistIds.includes(courseId), [wishlistIds]);
  const isInCart = useCallback((courseId: string) => cartIds.includes(courseId), [cartIds]);

  const openAuthModal = useCallback((mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setPendingBookCourseId(null);
    if (!booking.open && !courseDetailId) document.body.style.overflow = '';
  }, [booking.open, courseDetailId]);

  const completeAuth = useCallback(
    (authUser: AuthUser) => {
      setUser(authUser);
      setAuthModalOpen(false);
      const successMessage =
        authModalMode === 'register'
          ? 'Account created! Welcome to TOBC.'
          : authModalMode === 'book'
            ? 'Signed in — continuing your booking…'
            : 'Welcome back! You are now logged in.';
      toast(successMessage, 'success');
      const pending = pendingBookCourseId;
      setPendingBookCourseId(null);
      if (pending) {
        openBooking(bookingFromCourseId(pending, 1));
      } else if (!booking.open && !courseDetailId) {
        document.body.style.overflow = '';
      }
    },
    [authModalMode, courseDetailId, booking.open, openBooking, pendingBookCourseId, toast],
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

  const startBookNow = useCallback(
    (courseId: string) => {
      setCourseDetailId(null);
      if (!user) {
        setPendingBookCourseId(courseId);
        setAuthModalMode('book');
        setAuthModalOpen(true);
        document.body.style.overflow = 'hidden';
        return;
      }
      openBooking(bookingFromCourseId(courseId, 1));
    },
    [openBooking, user],
  );

  const completeOnboarding = useCallback(() => {
    try {
      sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setOnboardingOpen(false);
    if (!booking.open && !authModalOpen && !courseDetailId) {
      document.body.style.overflow = '';
    }
  }, [authModalOpen, booking.open, courseDetailId]);

  const skipOnboarding = completeOnboarding;

  const value = useMemo(
    () => ({
      role,
      setRole,
      user,
      isLoggedIn,
      loginWithEmail,
      registerWithEmail,
      logout,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      authModalOpen,
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
    }),
    [
      role,
      user,
      isLoggedIn,
      loginWithEmail,
      registerWithEmail,
      logout,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      authModalOpen,
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
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
