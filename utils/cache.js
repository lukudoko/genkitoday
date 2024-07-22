class ClientCache {
  constructor() {
    this.cacheKeyPrefix = 'cache_';
  }

  set(key, value, duration) {
    const now = new Date().getTime();
    const expiryTime = now + duration;
    const cacheObject = { value, expiryTime };
    localStorage.setItem(this.cacheKeyPrefix + key, JSON.stringify(cacheObject));
  }

  get(key) {
    const cacheItem = localStorage.getItem(this.cacheKeyPrefix + key);
    if (cacheItem) {
      const cacheObject = JSON.parse(cacheItem);
      const now = new Date().getTime();
      if (cacheObject.expiryTime > now) {
        return cacheObject.value;
      } else {
        this.remove(key); // Remove expired cache
      }
    }
    return null;
  }

  remove(key) {
    localStorage.removeItem(this.cacheKeyPrefix + key);
  }

  clearExpired() {
    const now = new Date().getTime();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.cacheKeyPrefix)) {
        const cacheItem = localStorage.getItem(key);
        if (cacheItem) {
          const cacheObject = JSON.parse(cacheItem);
          if (cacheObject.expiryTime <= now) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }
}

const clientCache = new ClientCache();
export default clientCache;
