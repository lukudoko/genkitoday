import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import News from '@/utils/news';
export default function Home() {


    return (
        <>
            <motion.div
                key="page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Head>
                    <title>Genki Today!</title>
                    <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
                </Head>
                <div className='flex fixed left-0 top-0 items-center justify-center w-screen h-20 backdrop-blur-md bg-teal-400/70 z-50'>
                    <div className='text-5xl p-4 text-white font-yellow'>Genki Today!</div>
                </div>
                <News />
            </motion.div>
        </>
    );
}
