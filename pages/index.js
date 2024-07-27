import { useEffect, useState } from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import clientCache from '@/utils/cache';
import { getPreviousChunkTimes } from '@/utils/chunks';
import Head from 'next/head';

export default function Home() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [footerText, setFooterText] = useState('');

    const oddItems = news.filter((_, index) => index % 2 !== 0);
    const evenItems = news.filter((_, index) => index % 2 === 0);
    

    const texts = [
        "All caught up!",
        "You've made it! (Didn't think you would...)",
        "Welcome to the bottom of the page!",
        "You can go away now!",
        "You've read everything! Have you considered touching grass?",
        "Now get off your phone.",
        "All done! No more news till later!"
    ];

    function getRandomText() {
        const randomIndex = Math.floor(Math.random() * texts.length);
        return texts[randomIndex];
    }

    useEffect(() => {
        async function getLoader() {
            const { squircle } = await import('ldrs');
            squircle.register();
        }
        getLoader();
    }, []);

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

                // Client-side time filtering
                const { chunkStartTime, chunkEndTime } = getPreviousChunkTimes();
                const chunkStartDate = new Date(chunkStartTime);
                const chunkEndDate = new Date(chunkEndTime);

                const filteredNews = data.news.filter(item => {
                    const pubDate = new Date(item.isoDate || item.pubDate);
                    return isAfter(pubDate, chunkStartDate) && isBefore(pubDate, chunkEndDate);
                });

                setNews(filteredNews);
                clientCache.set(CACHE_KEY, filteredNews, CACHE_DURATION); // Cache fetched data
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
            <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
            </Head>
            <div className='flex fixed left-0 top-0 items-center justify-center w-screen h-20 backdrop-blur-md bg-teal-400/70 z-50'>
                <div className='text-5xl p-4 text-white font-yellow'>Genki Today!</div>
            </div>
            <div id="cont" className="flex min-h-dvh flex-col items-center justify-center">
                <div className='flex flex-col items-center justify-center w-11/12 pt-24 pb-8 lg:w-4/5 max-w-[150ch]'>
                    {loading && <motion.div initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }} id="loader" className='flex w-48 font-sans items-center justify-center font-semibold text-teal-400 flex-col'>
                        <l-squircle size="90" stroke="20" stroke-length="0.15" bg-opacity="0.1" speed="0.9" color="#2DD4BF"  ></l-squircle>
                        <p className='animate-pulse text-center pt-16 text-2xl'>Loading your stories...</p>
                    </motion.div>}



                    {error && <p>{error}</p>}
                    {news.length === 0 && !loading && !error && (
                        <p >No news found</p>
                    )}


<div className="flex flex-col md:flex-row gap-8">
    <div className="flex-1">
        {evenItems.length > 0 && !loading && !error && evenItems.map((item, index) => {
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
                <motion.div
                layout
                    id="newsitem"
                    className="mb-8 border border-teal-400 rounded-xl bg-white w-full h-fit shadow-[5px_5px_0px_0px_rgba(45,212,191)] transform transition-transform duration-150 ease-in-out active:scale-[1.02] hover:scale-[1.02]"
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <a className="no-underline" href={item.link} target="_blank" rel="noopener noreferrer">
                        {imageUrl && <img src={imageUrl} alt={item.title || "News Image"} className="w-full h-auto rounded-t-xl m-0" />}
                        <div id="bod" className="font-sans p-3">
                            <div className="font-sans text-left hover:underline text-2xl lg:text-3xl font-extrabold">{item.title}</div>
                            <div className="text-sm pt-2 font-thin">{item.source} | {formattedDate}</div>
                            <hr className="border-t border-neutral-600 my-1" />
                            <div className="line-clamp-4 text-justify pt-3 h-fit font-medium text-sm">{item.contentSnippet}</div>
                        </div>
                    </a>
                </motion.div>
            );
        })}
    </div>
    <div className="flex-1">
        {oddItems.length > 0 && !loading && !error && oddItems.map((item, index) => {
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
                <motion.div
                layout
                    id="newsitem"
                    className="mb-8 border border-teal-400 rounded-xl bg-white w-full h-fit shadow-[5px_5px_0px_0px_rgba(45,212,191)] transform transition-transform duration-150 ease-in-out active:scale-[1.02] hover:scale-[1.02]"
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <a className="no-underline" href={item.link} rel="noopener noreferrer">
                        {imageUrl && <img src={imageUrl} alt={item.title || "News Image"} className="w-full h-auto rounded-t-xl m-0" />}
                        <div id="bod" className="font-sans p-3">
                            <div className="font-sans text-left hover:underline text-2xl lg:text-3xl font-extrabold">{item.title}</div>
                            <div className="text-sm pt-2 font-thin">{item.source} | {formattedDate}</div>
                            <hr className="border-t border-neutral-600 my-1" />
                            <div className="line-clamp-4 text-justify pt-3 h-fit font-medium text-sm">{item.contentSnippet}</div>
                        </div>
                    </a>
                </motion.div>
            );
        })}
    </div>
</div>

                </div>
                {!loading && news.length > 0 && (
                    <div id="footer" className='flex font-sans text-white items-center justify-center h-32 w-dvw bg-teal-400/70'>
                        <div className='text-xl font-bold text-center'>
                            {footerText}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
