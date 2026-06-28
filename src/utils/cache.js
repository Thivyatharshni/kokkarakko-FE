const memoryCache = new Map();

export const clientCache = {
  /**
   * Retrieves data from the cache.
   * @param {string} key - Cache key.
   * @returns {any|null} The cached data or null if not found/expired.
   */
  get: (key) => {
    const entry = memoryCache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.expiry;
    if (isExpired) {
      memoryCache.delete(key);
      return null;
    }
    return entry.data;
  },

  /**
   * Stores data in the cache.
   * @param {string} key - Cache key.
   * @param {any} data - Data to cache.
   * @param {number} [expiryMs=300000] - Expiration duration in milliseconds (default 5 minutes).
   */
  set: (key, data, expiryMs = 5 * 60 * 1000) => {
    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiryMs,
    });
  },

  /**
   * Invalidates cached keys matching a prefix or clears the entire cache.
   * @param {string} [keyPrefix] - Optional cache key prefix.
   */
  invalidate: (keyPrefix) => {
    if (!keyPrefix) {
      memoryCache.clear();
      return;
    }
    for (const key of memoryCache.keys()) {
      if (key.startsWith(keyPrefix)) {
        memoryCache.delete(key);
      }
    }
  },
};
