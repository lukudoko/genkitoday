// utils/cache.js

class Cache {
    constructor() {
      this.cache = {};
      this.expiryTime = null;
    }
  
    set(key, value, duration) {
      const now = new Date().getTime();
      const expiryTime = now + duration;
      this.cache[key] = { value, expiryTime };
    }
  
    get(key) {
      const now = new Date().getTime();
      const cachedItem = this.cache[key];
      if (cachedItem && cachedItem.expiryTime > now) {
        return cachedItem.value;
      }
      return null;
    }
  
    clearExpired() {
      const now = new Date().getTime();
      for (const key in this.cache) {
        if (this.cache[key].expiryTime <= now) {
          delete this.cache[key];
        }
      }
    }
  }
  
  const cache = new Cache();
  module.exports = cache;
  