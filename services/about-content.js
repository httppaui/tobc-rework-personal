/** About puzzle copy — loaded from JSON data file */

const DATA_URL = 'assets/data/about-puzzle.json';

let cache = null;

export async function loadAboutContent() {
  if (cache) return cache;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Failed to load ${DATA_URL}`);
  cache = await res.json();
  return cache;
}

export function getAboutContent(key) {
  return cache?.[key] ?? null;
}
