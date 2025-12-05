// lib/rateLimiter.ts

/**
 * In-memory sliding window rate limiter
 * Limit = 4 req / 60 seconds per IP
 */

type Record = {
  timestamp: number;
  count: number;
};

const WINDOW = 60 * 1000; // 1 minute
const LIMIT = 4;
const store = new Map<string, Record>();

export function limit(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  // First request
  if (!entry) {
    store.set(ip, { timestamp: now, count: 1 });
    return true;
  }

  const diff = now - entry.timestamp;

  // Window expired → reset
  if (diff > WINDOW) {
    store.set(ip, { timestamp: now, count: 1 });
    return true;
  }

  // Limit reached
  if (entry.count >= LIMIT) {
    return false;
  }

  // Increase request count
  store.set(ip, {
    timestamp: entry.timestamp,
    count: entry.count + 1,
  });

  return true;
}
