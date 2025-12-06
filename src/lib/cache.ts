import { unstable_cache } from "next/cache";

export function cacheQuery<T>(fn: () => Promise<T>, key: string, seconds: number) {
  return unstable_cache(fn, [key], {
    revalidate: seconds,
    tags: [key]
  });
}
