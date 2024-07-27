import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import clientCache from '@/utils/cache'; // Adjusted cache utility
import Head from 'next/head';
import { motion } from 'framer-motion';


export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [footerText, setFooterText] = useState('');

  const texts = [
    "All caught up!",
    "You\'ve made it! (Didn\'t think you would...)",
    "Welcome to the bottom of the page!",
    "You can go away now!",
    "You\'ve read everything! Have you considered touching grass?",
    "Now get off your phone.",
    "All done! No more news till later!"
  ];

  function getRandomText() {
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
  }

  useEffect(() => {
    async function getLoader() {
      const { squircle } = await import('ldrs')
      squircle.register()
    }
    getLoader()
  });


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


    setFooterText(getRandomText()); // Set the random text on component mount
    fetchData();
  }, []);

  return (
    <>
        <Head>
            <title>Genki Today!</title>
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
            <link rel="manifest" href="/icons/site.webmanifest" />
            <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
            <link rel="shortcut icon" href="/icons/favicon.ico" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="msapplication-config" content="/icons/browserconfig.xml" />
            <meta name="theme-color" content="#69decf" />
        </Head>
                      <div className='fixed top-0 flex items-center justify-center w-full h-fit backdrop-blur-md bg-teal-400/70 z-50'>
                        <div className='text-5xl p-4 text-white font-yellow'>Genki Today!</div>
                      </div>
                      <div id="cont" className="min-h-dvh flex flex-col items-center justify-center">
                        {loading && <motion.div initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }} id="loader" className='absolute flex pt-24 h-dvh w-48 font-sans items-center justify-center font-semibold text-teal-400 flex-col'>

                          <l-squircle size="90" stroke="20" stroke-length="0.15" bg-opacity="0.1" speed="0.9" color="#2DD4BF"  ></l-squircle>
                          <p className='animate-pulse text-center py-16 text-2xl'>Loading your stories...</p>
                        </motion.div>}
                        {error && <p>{error}</p>}
                        {news.length === 0 && !loading && !error && (
                          <p >No news found</p>
                        )}

                        <motion.div id="items" className='columns-1 md:columns-2 md:gap-8 lg:gap-5 w-11/12 transform transition-all duration-500 ease-in-out lg:w-4/5 max-w-[150ch] pb-12 pt-24'>
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
                              <motion.a layout transition={{ duration: 3, ease: "easeInOut" }} id="newsitem" className="block mb-8 w-full break-inside-avoid shadow-[5px_5px_0px_0px_rgba(45,212,191)] border border-teal-400 rounded-xl bg-white no-underline transform transition-transform duration-150 ease-in-out active:scale-[1.02] hover:scale-[1.02]" href={item.link} target="_blank" rel="noopener noreferrer" key={index}>
                                {imageUrl && <img src={imageUrl} alt={item.title || "News Image"} className="w-full h-auto rounded-t-xl m-0" />}
                                <div id="bod" className='font-sans p-3'>
                                  <div className='font-sans text-left hover:underline text-2xl lg:text-3xl font-extrabold'>{item.title}</div>
                                  <div className='text-sm pt-2 font-thin'>{item.source} | {formattedDate}</div>
                                  <hr className="border-t border-neutral-300 my-1" />
                                  <div className="line-clamp-4 text-justify pt-3 font-medium text-sm">{item.contentSnippet}</div>
                                </div>
                              </motion.a>

                            );
                          })}
                        </motion.div>
                        {!loading && news.length > 0 && (
                          <div id="footer" className='flex font-sans text-white items-center justify-center h-32 w-dvw bg-teal-400/70'>
                            <div className='text-3xl font-bold text-center'>
                              {footerText}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                    );
}
