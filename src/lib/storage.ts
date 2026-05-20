const CART_KEY = 'tobc_cart_v1';
const WISHLIST_KEY = 'tobc_wishlist_v1';

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
