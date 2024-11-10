import React, { useEffect, useState } from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import clientCache from '@/utils/cache';
import { getPreviousChunkTimes } from '@/utils/chunks';
import Loader from '@/components/loader'; 
import Card from '@/components/card';


// News Component
const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [footerText, setFooterText] = useState('');

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
                console.log(chunkStartTime)

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

    

    return (
        <div className="flex  flex-col items-center justify-center">
            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className='z-50'
                    >
                        <Loader />
                    </motion.div>
                )}
            </AnimatePresence>

            {!loading && (
                <div className="flex flex-col items-center justify-center w-11/12 pt-24 pb-8 lg:w-4/5 max-w-[150ch]">
                    <div className="w-full flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            {evenItems.length > 0 && evenItems.map((item, index) => (
                                <Card item={item} index={index} key={item.id || index} />
                            ))}
                        </div>
                        <div className="flex-1">
                            {oddItems.length > 0 && oddItems.map((item, index) => (
                                <Card item={item} index={index} key={item.id || index} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!loading && news.length > 0 && (
                <div id="footer" className='flex font-sans text-white items-center justify-center h-32 w-full bg-teal-400'>
                    <div className='text-xl p-4 font-bold text-center'>
                        {footerText}
                    </div>
                </div>
            )}
        </div>
    );
};

export default News;
