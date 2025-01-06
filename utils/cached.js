// utils/cache.js

import { getNextChunkStartTime } from '@/utils/nuchunks';

// Function to set cache with dynamic expiry
export const setCache = (chunk, data) => {
  const nextChunkStart = getNextChunkStartTime();
  const cacheExpiryTime = nextChunkStart.getTime(); // Expiry time set to the start of the next chunk
console.log(nextChunkStart);
  const cacheData = {
    articles: data,
    expiry: cacheExpiryTime,
  };
  
  localStorage.setItem(`newsitems`, JSON.stringify(cacheData));
};

// Function to get cache data
export const getCache = (chunk) => {
  const cacheData = localStorage.getItem(`newsitems`);
  if (cacheData) {
    return JSON.parse(cacheData);
  }
  return null;
};

// Function to check if the cache is expired
export const isCacheExpired = (chunk) => {
  const cacheData = getCache(chunk);
  if (cacheData && cacheData.expiry) {
    return Date.now() > cacheData.expiry; // Return true if the cache has expired
  }
  return true; // If no cache data, consider it expired
};
