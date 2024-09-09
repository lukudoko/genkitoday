import React, { useEffect, useState } from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import clientCache from '@/utils/cache';
import { getPreviousChunkTimes } from '@/utils/chunks';
import Loader from '@/utils/loader';

// NewsItem Component
const NewsItem = ({ item, index }) => {
    const pubDate = new Date(item.isoDate || item.pubDate);
    const formattedDate = format(pubDate, 'MMMM dd, yyyy h:mm a');
    const imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : [];
    let imageUrl = item.source === "The Guardian" && imageUrls.length > 1
        ? imageUrls[imageUrls.length - 1]
        : imageUrls[0];

    return (
        <motion.div
            layout
            className="mb-8 border border-teal-400 rounded-xl bg-white w-full h-fit shadow-[5px_5px_0px_0px_rgba(45,212,191)]"
            key={index}
            initial={{ opacity: 0, y: 500 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 40,
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeInOut"
                }
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        >
            <a className="no-underline" href={item.link} target="_blank" rel="noopener noreferrer">
                {imageUrl && <img src={imageUrl} alt={item.title || "News Image"} className="w-full h-auto rounded-t-xl m-0" />}
                <div className="font-sans p-3">
                    <div className="font-sans text-left hover:underline text-2xl lg:text-3xl font-extrabold">{item.title}</div>
                    <div className="text-sm pt-2 font-thin">{item.source} | {formattedDate}</div>
                    <hr className="border-t border-neutral-600 my-1" />
                    <div className="line-clamp-4 text-justify pt-3 h-fit font-medium text-sm">{item.contentSnippet}</div>
                </div>
            </a>
        </motion.div>
    );
};

// News Component
const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [footerText, setFooterText] = useState('');
    const [iframeUrl, setIframeUrl] = useState(null);
    const [iframeVisible, setIframeVisible] = useState(false);


    const texts = [
        "All caught up!",
        "You've made it! (Didn't think you would...)",
        "Welcome to the bottom of the page!",
        "You can go away now!",
        "You've read everything! Have you considered touching grass?",
        "Now get off your phone.",
        "All done! No more news till later!"
    ];

    const getRandomText = () => {
        const randomIndex = Math.floor(Math.random() * texts.length);
        return texts[randomIndex];
    };

    const oddItems = news.filter((_, index) => index % 2 !== 0);
    const evenItems = news.filter((_, index) => index % 2 === 0);

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

            try {
                const response = await fetch('/api/fetchNews');
                const data = await response.json();

                const { chunkStartTime, chunkEndTime } = getPreviousChunkTimes();
                const chunkStartDate = new Date(chunkStartTime);
                const chunkEndDate = new Date(chunkEndTime);

                const filteredNews = data.news.filter(item => {
                    const pubDate = new Date(item.isoDate || item.pubDate);
                    return isAfter(pubDate, chunkStartDate) && isBefore(pubDate, chunkEndDate);
                });

                setNews(filteredNews);
                clientCache.set(CACHE_KEY, filteredNews, CACHE_DURATION);
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

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center w-11/12 pt-24 pb-8 lg:w-4/5 max-w-[150ch]">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        {evenItems.length > 0 && evenItems.map((item, index) => (
                            <NewsItem item={item} index={index} key={item.id || index} />
                        ))}
                    </div>
                    <div className="flex-1">
                        {oddItems.length > 0 && oddItems.map((item, index) => (
                            <NewsItem item={item} index={index} key={item.id || index} />
                        ))}
                    </div>
                </div>
                
            </div>
            {!loading && news.length > 0 && (
                    <div id="footer" className='flex font-sans text-white items-center justify-center h-32 w-full bg-teal-400/70'>
                        <div className='text-xl font-bold text-center'>
                            {footerText}
                        </div>
                    </div>
                )}
        </div>
    );
};

export default News;
