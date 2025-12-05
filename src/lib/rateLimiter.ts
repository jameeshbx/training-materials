// src/lib/rateLimiter.ts

interface RateLimitEntry {
  count: number;
  start: number;
  lastRequest: number;
}

const store = new Map<string, RateLimitEntry>();

// Declare global type to fix TypeScript error
declare global {
  var rateLimitCleanup: NodeJS.Timeout | undefined;
}

// Optional: Periodic cleanup of old entries
if (typeof global !== 'undefined' && !global.rateLimitCleanup) {
  global.rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    const oneHourAgo = now - 3600000; // 1 hour (corrected from 36000000)
    
    for (const [ip, entry] of store.entries()) {
      // Remove entries older than 1 hour
      if (entry.lastRequest < oneHourAgo) {
        store.delete(ip);
      }
    }
  }, 300000); // Clean every 5 minutes
}

export function limit(
  ip: string, 
  maxRequests: number = 5, 
  windowMs: number = 60000
): { 
  success: boolean; 
  count: number; 
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  let entry = store.get(ip);

  if (!entry) {
    // First request from this IP
    entry = { 
      count: 1, 
      start: now,
      lastRequest: now
    };
    store.set(ip, entry);
  } else {
    // Check if window has expired
    if (now - entry.start > windowMs) {
      // Reset counter - new window
      entry.count = 1;
      entry.start = now;
      entry.lastRequest = now;
    } else {
      // Within window - increment counter
      entry.count++;
      entry.lastRequest = now;
    }
    store.set(ip, entry);
  }

  const remaining = Math.max(0, maxRequests - entry.count);
  const reset = entry.start + windowMs;

  return {
    success: entry.count <= maxRequests,
    count: entry.count,
    remaining,
    reset
  };
}

// Optional: Get rate limit info without counting
export function getRateLimitInfo(ip: string) {
  const entry = store.get(ip);
  if (!entry) {
    return null;
  }
  
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 5;
  
  // Check if window has expired
  if (now - entry.start > windowMs) {
    store.delete(ip); // Clean up expired entry
    return null;
  }
  
  const remaining = Math.max(0, maxRequests - entry.count);
  const reset = entry.start + windowMs;
  
  return {
    count: entry.count,
    remaining,
    reset,
    resetInSeconds: Math.ceil((reset - now) / 1000)
  };
}

// Optional: Clear rate limit for an IP (useful for testing)
export function clearRateLimit(ip: string) {
  store.delete(ip);
}

// Optional: Cleanup function to stop the interval
export function cleanupRateLimit() {
  if (global.rateLimitCleanup) {
    clearInterval(global.rateLimitCleanup);
    global.rateLimitCleanup = undefined;
  }
}