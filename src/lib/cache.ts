// lib/cache.ts

type CacheValue = any;

const store = new Map<string, { value: CacheValue; expiresAt: number | null }>();

export const cache = {
    async get(key: string) {
        const entry = store.get(key);
        if (!entry) return null;

        // TTL expired
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            store.delete(key);
            return null;
        }

        return entry.value;
    },

    async set(key: string, value: CacheValue, ttlSeconds?: number) {
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;

        store.set(key, { value, expiresAt });
    },

    async del(key: string) {
        store.delete(key);
    },
};
