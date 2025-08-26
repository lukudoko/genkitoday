import { getNextChunkStartTime } from '@/utils/chunks';

export const setCache = (chunk, data) => {
  const nextChunkStart = getNextChunkStartTime();
  const cacheExpiryTime = nextChunkStart.getTime();

  const cacheData = {
    articles: data,
    expiry: cacheExpiryTime,
    chunk: chunk,
  };

  localStorage.setItem(`newsitems_${chunk}`, JSON.stringify(cacheData));
};

export const getCache = (chunk) => {
  const cacheData = localStorage.getItem(`newsitems_${chunk}`);
  if (cacheData) {
    return JSON.parse(cacheData);
  }
  return null;
};

export const isCacheExpired = (chunk) => {
  const cacheData = getCache(chunk);
  if (cacheData && cacheData.expiry) {
    return Date.now() > cacheData.expiry;
  }
  return true;
};

export const clearAllCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('newsitems_')) {
      localStorage.removeItem(key);
    }
  });
};

export const clearChunkCache = (chunk) => {
  localStorage.removeItem(`newsitems_${chunk}`);
};