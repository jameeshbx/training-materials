// // src/lib/rateLimit.ts
// type WindowEntry = { timestamps: number[] };

// const store = new Map<string, WindowEntry>();

// export interface RateLimitOptions {
//     windowMs?: number;     // default window in ms
//     maxRequests?: number;  // max requests allowed
// }

// /**
//  * Check rate limit for a key. Returns { ok, remaining } or { ok: false, retryAfterMs }.
//  */
// export function checkRateLimit(
//     key: string,
//     opts: RateLimitOptions = { windowMs: 60_000, maxRequests: 5 }
// ) {
//     const windowMs = opts.windowMs ?? 60_000;
//     const maxRequests = opts.maxRequests ?? 5;
//     const now = Date.now();

//     let entry = store.get(key);
//     if (!entry) {
//         store.set(key, { timestamps: [now] });
//         return { ok: true, remaining: maxRequests - 1 };
//     }

//     // Purge old timestamps
//     entry.timestamps = entry.timestamps.filter((t) => t > now - windowMs);

//     if (entry.timestamps.length >= maxRequests) {
//         const retryAfterMs = entry.timestamps[0] + windowMs - now;
//         return { ok: false, retryAfterMs };
//     }

//     entry.timestamps.push(now);
//     return { ok: true, remaining: maxRequests - entry.timestamps.length };
// }

// /**
//  * Reset limiter for key (useful in tests)
//  */
// export function resetRateLimit(key: string) {
//     store.delete(key);
// }

// src/lib/rateLimit.ts
type WindowEntry = { timestamps: number[] }

const store = new Map<string, WindowEntry>()

export interface RateLimitOptions {
    windowMs?: number // default window in ms
    maxRequests?: number // max requests allowed
}

/**
 * Check rate limit for a key. Returns { ok, remaining } or { ok: false, retryAfterMs }.
 */
export function checkRateLimit(key: string, opts: RateLimitOptions = { windowMs: 60_000, maxRequests: 5 }) {
    const windowMs = opts.windowMs ?? 60_000
    const maxRequests = opts.maxRequests ?? 5
    const now = Date.now()

    const entry = store.get(key)
    if (!entry) {
        store.set(key, { timestamps: [now] })
        return { ok: true, remaining: maxRequests - 1 }
    }

    // Purge old timestamps
    entry.timestamps = entry.timestamps.filter((t) => t > now - windowMs)

    if (entry.timestamps.length >= maxRequests) {
        const retryAfterMs = entry.timestamps[0] + windowMs - now
        return { ok: false, retryAfterMs }
    }

    entry.timestamps.push(now)
    return { ok: true, remaining: maxRequests - entry.timestamps.length }
}

/**
 * Reset limiter for key (useful in tests)
 */
export function resetRateLimit(key: string) {
    store.delete(key)
}
