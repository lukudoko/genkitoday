import { setHours, parse, set, getHours, format, formatISO, setMinutes, setSeconds, startOfDay, addDays } from 'date-fns';

const now = new Date();

export function getCurrentChunkEndTime() {

        const hour = getHours(now);
        let nextChunk;
      
        if (hour >= 21 || hour < 9) {
            nextChunk = setHours(startOfDay(now), 9);
            nextChunk = addDays(nextChunk, 1);
            if (hour < 9) {
              nextChunk = setHours(startOfDay(now), 9);
            }
        } else if (hour >= 9 && hour < 15) {
            nextChunk = setHours(startOfDay(now), 15);//15
        } else {
            nextChunk = setHours(startOfDay(now), 21);
        }
      
        return { nextChunk };
      }

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
    
    // Store the next chunk start time

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
