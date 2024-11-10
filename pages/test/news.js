import React, { useEffect, useState, useCallback, memo } from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import clientCache from '@/utils/cache';
import { getPreviousChunkTimes } from '@/utils/chunks';
import Loader from '@/components/loader';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Moved to separate file: constants.js
const CACHE_KEY = 'rss';
const CACHE_DURATION = 6 * 60 * 60 * 1000;
const FOOTER_TEXTS = [
    "All caught up!",
    "You've made it! (Didn't think you would...)",
    "Welcome to the bottom of the page!",
    "You can go away now!",
    "You've read everything! Have you considered touching grass?",
    "Now get off your phone.",
    "All done! No more news till later!"
];

// Memoized NewsItem Component
const NewsItem = memo(({ item, index }) => {
    const pubDate = new Date(item.isoDate || item.pubDate);
    const formattedDate = format(pubDate, 'MMMM dd, yyyy h:mm a');
    const imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : [];
    const imageUrl = item.source === "The Guardian" && imageUrls.length > 1
        ? imageUrls[imageUrls.length - 1]
        : imageUrls[0];

    return (
        <motion.div
            layout
            className="mb-8 border border-teal-400 rounded-xl bg-white w-full h-fit shadow-[5px_5px_0px_0px_rgba(45,212,191)]"
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <a 
                className="no-underline block h-full" 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Read more about ${item.title}`}
            >
                {imageUrl && (
                    <div className="aspect-video relative overflow-hidden rounded-t-xl">
                        <img 
                            src={imageUrl} 
                            alt={item.title || "News Image"} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}
                <div className="font-sans p-3">
                    <h2 className="font-sans text-left hover:underline text-2xl lg:text-3xl font-extrabold">{item.title}</h2>
                    <div className="text-sm pt-2 font-thin">{item.source} | {formattedDate}</div>
                    <hr className="border-t border-neutral-600 my-1" />
                    <p className="line-clamp-4 text-justify pt-3 h-fit font-medium text-sm">{item.contentSnippet}</p>
                </div>
            </a>
        </motion.div>
    );
});

NewsItem.displayName = 'NewsItem';

// Custom hook for news data
const useNews = () => {
    const [state, setState] = useState({
        news: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchNews = async () => {
            // Try to load from local storage cache
            const cachedNews = clientCache.get(CACHE_KEY);
            if (cachedNews) {
                setState(prev => ({ ...prev, news: cachedNews, loading: false }));
                return;
            }

            try {
                const response = await fetch('/api/fetchNews');
                const data = await response.json();

                const { chunkStartTime, chunkEndTime } = getPreviousChunkTimes();
                const filteredNews = data.news.filter(item => {
                    const pubDate = new Date(item.isoDate || item.pubDate);
                    return isAfter(pubDate, new Date(chunkStartTime)) && 
                           isBefore(pubDate, new Date(chunkEndTime));
                });

                setState(prev => ({ ...prev, news: filteredNews, loading: false }));
                clientCache.set(CACHE_KEY, filteredNews, CACHE_DURATION);
            } catch (error) {
                console.error('Error fetching news:', error);
                setState(prev => ({ 
                    ...prev, 
                    error: 'Failed to load news. Please try again later.',
                    loading: false 
                }));
            }
        };

        fetchNews();
    }, []);

    return state;
};

// Main News Component
const News = () => {
    const { news, loading, error } = useNews();
    const [footerText] = useState(() => 
        FOOTER_TEXTS[Math.floor(Math.random() * FOOTER_TEXTS.length)]
    );

    const oddItems = news.filter((_, index) => index % 2 !== 0);
    const evenItems = news.filter((_, index) => index % 2 === 0);

    if (loading) return <Loader />;
    
    if (error) return (
        <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center w-11/12 pt-24 pb-8 lg:w-4/5 max-w-[150ch]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div>
                        <AnimatePresence>
                            {evenItems.map((item, index) => (
                                <NewsItem 
                                    key={item.id || `even-${index}`}
                                    item={item} 
                                    index={index} 
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div>
                        <AnimatePresence>
                            {oddItems.map((item, index) => (
                                <NewsItem 
                                    key={item.id || `odd-${index}`}
                                    item={item} 
                                    index={index} 
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            {news.length > 0 && (
                <footer className="flex font-sans text-white items-center justify-center h-32 w-full bg-teal-400/70">
                    <p className="text-xl font-bold text-center">
                        {footerText}
                    </p>
                </footer>
            )}
        </div>
    );
};

export default News;