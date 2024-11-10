import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Image from 'next/image'

const Card = ({ item, index }) => {
    const pubDate = new Date(item.isoDate || item.pubDate);
    const formattedDate = format(pubDate, 'MMMM dd, yyyy h:mm a');
    const imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : [];
    let imageUrl = item.source === "The Guardian" && imageUrls.length > 1
        ? imageUrls[imageUrls.length - 1]
        : imageUrls[0];

    return (
        <motion.div
            className="mb-8 mx-2 border overflow-hidden border-teal-400 z-0 rounded-3xl bg-white  h-fit shadow-[5px_5px_0px_0px_rgba(45,212,191)]"
            key={index}
            initial={{ opacity: 0, y: 500 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 40,  // Optionally test with 50–60 if you want less bounce
                    duration: 0.5,
                    delay: index * 0.1,
                }
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        >
            <a className="no-underline" href={item.link} target="_blank" rel="noopener noreferrer">
                {imageUrl && <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
                    <Image
                        src={imageUrl}
                        alt={item.title || "News Image"}
                        placeholder="blur"
                        quality={100}
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPUvbK/HgAFNwJBbElZhQAAAABJRU5ErkJggg=="
                        fill={true}
                        sizes="100vw"
                        className="rounded-b-3xl object-cover" // Apply any additional styling
                    />
                </div>}
                <div className="font-sans p-4">
                    <div className="font-sans text-pretty text-left hover:underline text-2xl lg:text-3xl font-extrabold">{item.title}</div>
                    <div className="text-xs pt-2 font-thin">{item.source} | {formattedDate}</div>
                    <hr className="border-t border-neutral-600 my-1" />
                    <div className="line-clamp-4 text-justify pt-3 h-fit font-medium text-sm">{item.contentSnippet}</div>
                </div>
            </a>
        </motion.div>
    );
};

export default Card;
