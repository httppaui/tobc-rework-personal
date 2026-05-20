const CART_KEY = 'tobc_cart_v1';
const WISHLIST_KEY = 'tobc_wishlist_v1';
const NOTIFICATIONS_KEY = 'tobc_notifications_v1';

/** Stored notification row (see types AppNotification) */
export type StoredNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export function loadIdList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveIdList(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function loadCart(): string[] {
  return loadIdList(CART_KEY);
}

export function saveCart(ids: string[]) {
  saveIdList(CART_KEY, ids);
}

export function loadWishlist(): string[] {
  return loadIdList(WISHLIST_KEY);
}

export function saveWishlist(ids: string[]) {
  saveIdList(WISHLIST_KEY, ids);
}

export function loadNotifications(): StoredNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (row: unknown): row is StoredNotification =>
          typeof row === 'object' &&
          row !== null &&
          typeof (row as StoredNotification).id === 'string' &&
          typeof (row as StoredNotification).title === 'string' &&
          typeof (row as StoredNotification).body === 'string',
      )
      .map((n) => ({
        ...n,
        read: Boolean(n.read),
      }));
  } catch {
    return [];
  }
}

export function saveNotifications(items: StoredNotification[]) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items.slice(0, 40)));
  } catch {
    /* ignore */
  }
}
