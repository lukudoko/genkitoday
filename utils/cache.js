import { getCurrentChunkEndTime } from '@/utils/chunks'; // Ensure you have this function


  //const now = new Date('2024-07-23T17:00:00'); 
 const now = new Date().getTime();


class ClientCache {
  constructor() {
    this.cacheKeyPrefix = 'cache_';
    this.nextChunkKey = 'next_chunk_time'; // Key for storing the next chunk start time
  }

  set(key, value, duration) {
    const expiryTime = now + duration;
    const cacheObject = { value, expiryTime };
    localStorage.setItem(this.cacheKeyPrefix + key, JSON.stringify(cacheObject));
    
    // Store the next chunk start time
    const nextChunkStartTime = getCurrentChunkEndTime().nextChunk.getTime(); // Assuming this returns the Date object
    localStorage.setItem(this.nextChunkKey, nextChunkStartTime.toString());
  }

  get(key) {
    const cacheItem = localStorage.getItem(this.cacheKeyPrefix + key);
    if (cacheItem) {
      const cacheObject = JSON.parse(cacheItem);

      
      // Check if current time is past the next chunk start time
      const nextChunkStartTime = parseInt(localStorage.getItem(this.nextChunkKey), 10);
      if (now >= nextChunkStartTime) {
        console.log("bye cache")
        this.remove(key); // Clear cache if past the chunk start time
        return null; // Return null to force fetching new data
      }

      if (cacheObject.expiryTime > now) {
        console.log("welcome cache")
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
