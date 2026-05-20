import { apiRequest } from './api';

export async function fetchWishlist(): Promise<string[] | null> {
  const result = await apiRequest<{ courseIds: string[] }>('/api/lists/wishlist');
  return result.ok ? result.data.courseIds : null;
}

export async function saveWishlistApi(courseIds: string[]): Promise<boolean> {
  const result = await apiRequest<{ courseIds: string[] }>('/api/lists/wishlist', {
    method: 'PUT',
    body: JSON.stringify({ courseIds }),
  });
  return result.ok;
}

export async function fetchCart(): Promise<string[] | null> {
  const result = await apiRequest<{ courseIds: string[] }>('/api/lists/cart');
  return result.ok ? result.data.courseIds : null;
}

export async function saveCartApi(courseIds: string[]): Promise<boolean> {
  const result = await apiRequest<{ courseIds: string[] }>('/api/lists/cart', {
    method: 'PUT',
    body: JSON.stringify({ courseIds }),
  });
  return result.ok;
}
