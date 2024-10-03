import { motion } from 'framer-motion';
import { useEffect } from 'react';
import React from 'react';



const Loader = () => {

    useEffect(() => {
        async function getLoader() {
            const { hourglass } = await import('ldrs');
            hourglass.register();
        }
        getLoader();
    }, []);


    return (
        <div
            id="loader"
            className="fixed top-0 left-0 flex w-dvw z-11 h-dvh max-h-dvh bg-[#69decf] font-sans items-center justify-center font-semibold text-white flex-col"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="flex items-center justify-center flex-col"
            >


                <l-hourglass size="100" bg-opacity="0.4" speed="1.3" color="#FFF"  ></l-hourglass>
                <p className="animate-pulse text-center pt-16 text-2xl">Loading your stories...</p>
            </motion.div>

        </div>
    );
};

export default Loader;
