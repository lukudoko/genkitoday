import { useState, useEffect } from 'react';
import axios from 'axios';
import { shuffleArray } from '@/utils/shuffled'; // Import shuffle function
import { getLastTimeChunk, filterArticlesByLastChunk } from '@/utils/nuchunks'; // Import chunk logic
import { getCache, setCache, isCacheExpired } from '@/utils/cached'; // Import cache functions
import Card from '@/components/nucard'; // Assuming you have a Card component for displaying articles

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const lastChunk = getLastTimeChunk();

      // Check if the cache exists and is not expired
      const cachedArticles = getCache(lastChunk);
      if (cachedArticles && !isCacheExpired(lastChunk)) {
        // If cached articles are available and not expired, use them
        setArticles(cachedArticles.articles);
        setLoading(false);
      } else {
        try {
          // Fetch new articles if cache is expired or doesn't exist
          const response = await axios.get('/api/news'); // Adjust API path if needed
          const fetchedArticles = response.data.articles;

          // Filter articles by the last completed chunk
          const filteredArticles = filterArticlesByLastChunk(fetchedArticles, lastChunk);

          // Shuffle the filtered articles for variety
          const shuffledArticles = shuffleArray(filteredArticles);

          // Cache the new articles with updated expiry logic
          setCache(lastChunk, shuffledArticles);

          // Set the shuffled articles to state
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
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {articles.map((article, index) => (
        <Card key={index} article={article} />
      ))}
    </div>
  );
};

export default News;
