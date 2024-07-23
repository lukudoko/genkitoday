import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import clientCache from '@/utils/cache'; // Adjusted cache utility
import Head from 'next/head'

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const CACHE_KEY = 'rss';
      const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

      // Try to load from local storage cache
      const cachedNews = clientCache.get(CACHE_KEY);
      if (cachedNews) {
        setNews(cachedNews);
        return;
      }

      // Fetch data from API
      try {
        const response = await fetch('/api/fetchNews');
        const data = await response.json();
        setNews(data.news || []);
        clientCache.set(CACHE_KEY, data.news || [], CACHE_DURATION); // Cache fetched data
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      }
    }

    fetchData();
  }, []);

  
  return (
<>
    <Head>
        <title>Genki Today!</title>
        <meta name="theme-color" content="#69decf" />
      </Head>
    <div className='bg-stone-100 min-h-dvh'>
      <div className='fixed top-0 flex items-center justify-center w-full h-fit backdrop-blur-md bg-teal-400/70'>
        <div className='text-5xl p-4 text-white font-yellow'>Genki Today!</div>
      </div>
      {news.length === 0 ? (
        <p>No news found</p>
      ) : (
        <div id="post" className="flex items-center justify-center">
          <div id="stuff" className='flex flex-col items-center justify-center gap-4 prose pt-24'>
            {news.map((item, index) => {
              const pubDate = new Date(item.isoDate || item.pubDate);
              const formattedDate = format(pubDate, 'yyyy-MM-dd HH:mm:ss');

                // Ensure item.imageUrls is an array and not null
                const imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : [];
                let imageUrl = imageUrls[0]; // Default to the first image

                // Use the last image for The Guardian if there are multiple images
                if (item.source === "The Guardian" && imageUrls.length > 1) {
                  imageUrl = imageUrls[imageUrls.length - 1]; // Use the last image
                }
                
              
              return (
                <a id="newsitem" className="w-11/12 md:w-full px-4 py-2 rounded-xl bg-white no-underline" href={item.link} target="_blank" key={index}>
                    <div id="head" className='py-2'>
                    {imageUrl && <img src={imageUrl} alt="News Image" className="w-full h-auto rounded-t-xl" />}
                      <div className='font-sans tracking-tight text-pretty leading-normal hover:underline text-4xl font-extrabold'>{item.title} </div>
                    </div>
                    <div className='font-sans'>
                      <small className='font-light'>{item.source} - Sentiment Score: {item.sentimentScore}, {item.sentimentLabel}</small>
                      <p className="line-clamp-3">{item.contentSnippet}</p>
                      <p><strong>Published at:</strong> {formattedDate}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
