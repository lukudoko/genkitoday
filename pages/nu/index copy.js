import { useEffect, useState } from 'react';

// Helper function for shuffling
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const ArticlesDisplay = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch('/api/news'); // Replace with your actual API endpoint
      const data = await response.json();

      if (data.success) {
        let filteredArticles = data.articles;

        // Optionally shuffle the articles
        filteredArticles = shuffleArray(filteredArticles);

        setArticles(filteredArticles);
      } else {
        console.error('Failed to fetch articles:', data.message);
      }
    };

    fetchArticles();
  }, []);

  // Render the articles
  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              {article.title} (Sentiment: {article.source})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticlesDisplay;
