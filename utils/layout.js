import { useState, useEffect } from 'react';
import axios from 'axios';
import { shuffleArray } from '@/utils/shuffled'; 
import { getLastTimeChunk, filterArticlesByLastChunk } from '@/utils/nuchunks'; 
import { getCache, setCache, isCacheExpired } from '@/utils/cached'; 
import Card from '@/components/nucard'; 
import Loader from "@/components/loader"

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

          const response = await axios.get('/api/news'); 
          const fetchedArticles = response.data.articles;
console.log(fetchArticles);
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
<div className="flex flex-col items-center justify-center px-4">
  <div className="w-full max-w-32 mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {articles.map((article, index) => (
        <Card key={index} article={article} />
      ))}
    </div>
  </div>
</div>



  );
};

export default News;