import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { shuffleArray } from '@/utils/shuffle';
import { getLastTimeChunk, filterArticlesByLastChunk } from '@/utils/chunks';
import { getCache, setCache, isCacheExpired } from '@/utils/cache';
import { useLoading } from '@/contexts/LoadingContext'; 
import Card from '@/components/card';
import { motion } from 'framer-motion';

const CACHE_CHECK_INTERVAL = 6000;

const ArticleSkeleton = () => (
  <div className="border overflow-hidden border-teal-400 rounded-3xl bg-white h-fit shadow-[5px_5px_0px_0px_rgba(45,212,191)] animate-pulse">
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-200">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
    </div>
    <div className="p-4">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="pt-2 flex items-center space-x-2">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-2 w-1 h-1 mt-1"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="border-t border-gray-200 my-2 w-1/2"></div>
      <div className="pt-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        <div className="h-3 bg-gray-200 rounded w-3/6"></div>
      </div>
    </div>
  </div>
);

const News = () => {
  const [articles, setArticles] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const isFirstMount = useRef(true);

  const { isLoading, setIsLoading } = useLoading();

  const fetchArticles = async (isInitialLoad = false) => {
    const lastChunk = getLastTimeChunk();
    const startTime = Date.now();

    if (isInitialLoad && isFirstMount.current) {
      setIsLoading(true);
    }

    const cachedArticles = getCache(lastChunk);
    if (cachedArticles && !isCacheExpired(lastChunk) && !forceRefresh) {
      const duration = Date.now() - startTime;
      const remainingTime = Math.max(1000 - duration, 0);
      setTimeout(() => {
        setArticles(cachedArticles.articles);
        if (isInitialLoad && isFirstMount.current) {
          setIsLoading(false);
          setHasInitiallyLoaded(true);
          isFirstMount.current = false;
        } else if (isInitialLoad) {
          setHasInitiallyLoaded(true);
        }
        setForceRefresh(false);
        setIsRefreshing(false);
      }, remainingTime);
    } else {
      try {

        if (!isFirstMount.current) {
          setIsRefreshing(true);
        }

        const response = await axios.get('/api/newsnu');
        const fetchedArticles = response.data.articles;

        const filteredArticles = filterArticlesByLastChunk(fetchedArticles);
        const shuffledArticles = shuffleArray(filteredArticles);

        setCache(lastChunk, shuffledArticles);

        const duration = Date.now() - startTime;
        const remainingTime = Math.max(1000 - duration, 0);
        setTimeout(() => {
          setArticles(shuffledArticles);
          if (isInitialLoad && isFirstMount.current) {
            setIsLoading(false);
            setHasInitiallyLoaded(true);
            isFirstMount.current = false;
          } else if (isInitialLoad) {
            setHasInitiallyLoaded(true);
          }
          setForceRefresh(false);
          setIsRefreshing(false);
        }, remainingTime);
      } catch (error) {
        console.error('Error fetching articles:', error);
        if (isInitialLoad && isFirstMount.current) {
          setIsLoading(false);
          setHasInitiallyLoaded(true);
          isFirstMount.current = false;
        } else if (isInitialLoad) {
          setHasInitiallyLoaded(true);
        }
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {

    fetchArticles(true);

    const interval = setInterval(() => {
      const lastChunk = getLastTimeChunk();
      if (isCacheExpired(lastChunk)) {

        fetchArticles(false);
      }
    }, CACHE_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [forceRefresh]);

  useEffect(() => {
    window.refreshNewsArticles = () => {
    //  console.log('Refreshing news articles due to settings change');
      setForceRefresh(true);
    };

    return () => {
      delete window.refreshNewsArticles;
    };
  }, []);

  if (isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center px-6 md:px-12">
        <div className="flex flex-col items-center justify-center pt-4 pb-8 w-full max-w-screen-lg">
          <motion.div
            className="w-full flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-1 flex-col gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <ArticleSkeleton key={`skeleton-left-${index}`} />
              ))}
            </div>
            <div className="flex flex-col flex-1 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <ArticleSkeleton key={`skeleton-right-${index}`} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoading && !hasInitiallyLoaded && isFirstMount.current) {
    return null; 
  }

  // Check if there are no articles to display
  if (hasInitiallyLoaded && articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 md:px-12 min-h-[60vh]">
        <div className="flex flex-col items-center justify-center pt-6 pb-8 w-full max-w-screen-lg">
          <div className="text-center p-8 border-1 rounded-3xl border-teal-400 z-0 rounded-3xl bg-white h-fit shadow-[5px_5px_0px_0px_rgba(45,212,191)]">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No News! :(</h2>
            <p className="text-gray-600 mb-4">It looks like you haven&apos;t added any feeds yet!</p>
            <p className="text-gray-500 text-sm">
              Add feeds in the menu to start seeing news articles here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 md:px-12">
      <div className="flex flex-col items-center justify-center pt-6 pb-8 w-full max-w-screen-lg">
        <div className="w-full flex flex-col md:flex-row gap-8">
          <div className="flex flex-1 flex-col gap-6">
            {articles.filter((_, index) => index % 2 === 0).map((article, index) => (
              <motion.div
                key={`even-${article.id || index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
              >
                <Card article={article} index={index} />
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col flex-1 gap-6">
            {articles.filter((_, index) => index % 2 !== 0).map((article, index) => (
              <motion.div
                key={`odd-${article.id || index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
              >
                <Card article={article} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;