// lib/rateLimiter.ts
type Entry = { count: number; firstRequestAt: number };

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // allow 5 reqs per window per key

const store = new Map<string, Entry>();

export function tooManyRequests(key: string) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, firstRequestAt: now });
    return false;
  }

  if (now - entry.firstRequestAt > WINDOW_MS) {
    // reset window
    store.set(key, { count: 1, firstRequestAt: now });
    return false;
  }

  entry.count += 1;
  store.set(key, entry);
  return entry.count > MAX_REQUESTS;
}
