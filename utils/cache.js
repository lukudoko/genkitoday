import { getCurrentChunkEndTime } from '@/utils/chunks';

class ClientCache {
  constructor() {
    this.cacheKeyPrefix = 'cache_';
    this.nextChunkKey = 'next_chunk_time'; // Key for storing the next chunk start time
  }

  set(key, value, duration) {
    const now = new Date().getTime(); // Get current time in milliseconds
    const expiryTime = now + duration; // Calculate expiry time
    const cacheObject = { value, expiryTime };
    localStorage.setItem(this.cacheKeyPrefix + key, JSON.stringify(cacheObject));

    // Update the next chunk start time
    const nextChunkStartTime = getCurrentChunkEndTime().nextChunk.getTime(); 
    localStorage.setItem(this.nextChunkKey, nextChunkStartTime.toString()); // Store as string for simplicity
  }

  get(key) {
    const now = new Date().getTime(); // Get current time in milliseconds
    const cacheItem = localStorage.getItem(this.cacheKeyPrefix + key);
    
    if (cacheItem) {
      const cacheObject = JSON.parse(cacheItem);

      // Check if current time is past the next chunk start time
      const nextChunkStartTime = parseInt(localStorage.getItem(this.nextChunkKey), 10);
      if (now >= nextChunkStartTime) {
        console.log("Cache expired due to chunk change");
        this.remove(key); // Clear cache if past the chunk start time
        return null; // Return null to force fetching new data
      }

      if (cacheObject.expiryTime > now) {
        console.log("Cache is valid");
        return cacheObject.value;
      } else {
        console.log("Cache expired");
        this.remove(key); // Remove expired cache
      }
    }
    return null;
  }

  remove(key) {
    localStorage.removeItem(this.cacheKeyPrefix + key);
  }

  clearExpired() {
    const now = new Date().getTime(); // Get current time in milliseconds
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
