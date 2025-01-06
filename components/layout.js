import { useState, useEffect } from 'react';
import axios from 'axios';
import { shuffleArray } from '@/utils/shuffled';
import { getLastTimeChunk, filterArticlesByLastChunk } from '@/utils/nuchunks';
import { getCache, setCache, isCacheExpired } from '@/utils/cached';
import Card from '@/components/nucard';
import Loader from "@/components/loader";
import { motion } from 'framer-motion';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const lastChunk = getLastTimeChunk();

      const cachedArticles = getCache(lastChunk);
      if (cachedArticles && !isCacheExpired(lastChunk)) {
        setArticles(cachedArticles.articles);
        setLoading(false);
      } else {
        try {
          const response = await axios.get('/api/news', {
            headers: {
              'x-api-key': 'kYWagdynRnZoWXRlZFjWWNqa3LDiblcz0ySy9RmCMUc=', // the key from your .env file
            }
          });
          const fetchedArticles = response.data.articles;

          const filteredArticles = filterArticlesByLastChunk(fetchedArticles, lastChunk);

          const shuffledArticles = shuffleArray(filteredArticles);

          setCache(lastChunk, shuffledArticles);

          setArticles(shuffledArticles);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching articles:', error);
          setLoading(false);
        }
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (<Loader />);
  }

  return (
    <div className="flex flex-col items-center justify-center px-6  md:px-12"    >
      <div className="flex flex-col items-center justify-center  pt-24 pb-8 w-full max-w-screen-lg">
        <motion.div
          className="w-full flex flex-col md:flex-row gap-6"
          initial={{ opacity: 0, y: 500 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 50,
            }
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
    </div>
  );
};

export default News;
