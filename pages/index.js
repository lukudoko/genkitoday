import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import clientCache from '@/utils/cache'; // Adjusted cache utility
import Head from 'next/head';
import BounceLoader from "react-spinners/BounceLoader";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    async function fetchData() {
      const CACHE_KEY = 'rss';
      const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

      // Try to load from local storage cache
      const cachedNews = clientCache.get(CACHE_KEY);
      if (cachedNews) {
        setNews(cachedNews);
        setLoading(false);
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
        setError('Failed to load news.');
        setNews([]);
      } finally {
        setLoading(false);
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
      <div className='bg-stone-50 min-h-dvh'>
        <div className='fixed top-0 flex items-center justify-center w-full h-fit backdrop-blur-md bg-teal-400/70 z-50'>
          <div className='text-5xl p-4 text-white font-yellow'>Genki Today!</div>
        </div>
        <div id="body" className="flex flex-col items-center justify-center">
          <div id="items" className='flex flex-col min-h-dvh md:flex-row flex-wrap w-11/12 lg:w-4/5 items-center justify-center lg:items-start gap-8 max-w-[150ch] pb-12 pt-24'>
            {loading && <div className='flex font-yellow justify-center items-center text-teal-400 flex-col'><BounceLoader
              color="#2DD4BF"
              loading
              size={130}
              speedMultiplier={2}
            /><p className='text-4xl py-12'>Loading your news...</p>
            </div>}
            {error && <p>{error}</p>}
            {news.length === 0 && !loading && !error && (
              <p >No news found</p>
            )}
            {news.length > 0 && !loading && !error && news.map((item, index) => {
              const pubDate = new Date(item.isoDate || item.pubDate);
              const formattedDate = format(pubDate, 'MMMM dd, yyyy h:mm a');

              // Ensure item.imageUrls is an array and not null
              const imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : [];
              let imageUrl = imageUrls[0]; // Default to the first image

              // Use the last image for The Guardian if there are multiple images
              if (item.source === "The Guardian" && imageUrls.length > 1) {
                imageUrl = imageUrls[imageUrls.length - 1]; // Use the last image
              }

              return (
                <a id="newsitem" className="lg:w-2/5 shadow-[5px_5px_0px_0px_rgba(45,212,191)] border border-teal-400 rounded-xl bg-white no-underline transform transition-transform duration-150 ease-in-out hover:scale-[1.02]" href={item.link} target="_blank" rel="noopener noreferrer" key={index}>
                  {imageUrl && <img src={imageUrl} alt={item.title || "News Image"} className="w-full h-auto rounded-t-xl m-0" />}
                  <div id="bod" className='font-sans p-3'>
                    <div className='font-sans text-left hover:underline text-2xl md:text-4xl font-extrabold'>{item.title}</div>
                    <div className='text-sm pt-2 font-thin'>{item.source} | {formattedDate}</div>
                    <hr className="border-t border-neutral-300 my-1" />
                    <div className="line-clamp-4 text-justify pt-3 font-medium text-sm">{item.contentSnippet}</div>
                  </div>
                </a>

              );
            })}
          </div>
          {!loading && news.length > 0 && (
            <div id="footer" className='flex font-yellow text-white items-center justify-center h-32 w-dvw bg-teal-400/70'>
              <div className='text-3xl text-center'>
                Yay! You're all caught up! (For now...)
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
