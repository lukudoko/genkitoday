import { useState, useEffect } from 'react';
import axios from 'axios';
import { shuffleArray } from '@/utils/shuffle';
import { getLastTimeChunk, filterArticlesByLastChunk } from '@/utils/chunks';
import { getCache, setCache, isCacheExpired } from '@/utils/cache';
import Card from '@/components/card';
import Loader from "@/components/loader";
import { motion, AnimatePresence } from 'framer-motion';

const CACHE_CHECK_INTERVAL = 6000; 

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    const lastChunk = getLastTimeChunk();
    const startTime = Date.now(); 

    const cachedArticles = getCache(lastChunk);
    if (cachedArticles && !isCacheExpired(lastChunk)) {
      const duration = Date.now() - startTime;
      const remainingTime = Math.max(1000 - duration, 0); 
      setTimeout(() => {
        setArticles(cachedArticles.articles);
        setLoading(false);
      }, remainingTime);
    } else {
      try {
        const response = await axios.get('/api/news', {
          headers: {
            'x-api-key': 'kYWagdynRnZoWXRlZFjWWNqa3LDiblcz0ySy9RmCMUc=', 
          }
        });
        const fetchedArticles = response.data.articles;

        const filteredArticles = filterArticlesByLastChunk(fetchedArticles, lastChunk);
        const shuffledArticles = shuffleArray(filteredArticles);

        setCache(lastChunk, shuffledArticles);

        const duration = Date.now() - startTime;
        const remainingTime = Math.max(1000 - duration, 0); 
        setTimeout(() => {
          setArticles(shuffledArticles);
          setLoading(false);
        }, remainingTime);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {

    fetchArticles();

    const interval = setInterval(() => {
      const lastChunk = getLastTimeChunk();
      if (isCacheExpired(lastChunk)) {
        fetchArticles();
      }
    }, CACHE_CHECK_INTERVAL);

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-6 md:px-12">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="flex flex-col items-center justify-center pt-24 pb-8 w-full max-w-screen-lg">
          <motion.div
            className="w-full flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, y: 500 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 50,
              },
            }}
          >
            <div className="flex flex-1 flex-col gap-6">
              {articles.filter((_, index) => index % 2 === 0).map((article, index) => (
                <Card key={index} article={article} index={index} />
              ))}
            </div>
            <div className="flex flex-col flex-1 gap-6">
              {articles.filter((_, index) => index % 2 !== 0).map((article, index) => (
                <Card key={index} article={article} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default News;