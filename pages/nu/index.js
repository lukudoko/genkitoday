import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import News from "@/utils/layout"

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
    <>
        <Head>
            <title>Genki Today!</title>
            <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
        </Head>
        <header className="z-30 flex fixed left-0 top-0 items-center justify-center w-screen h-20 bg-teal-400">
          <div className="text-5xl p-4 text-white font-yellow">
            Genki Today!
          </div>
        </header>
        <main>
        <News />
        </main>
</>
  );
};

export default ArticlesDisplay;
