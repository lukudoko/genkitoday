import { useEffect, useState } from 'react';
import { useSettings } from '@/contexts/settingsContext';
import { useLoading } from '@/contexts/LoadingContext';
import Head from 'next/head';
import News from "@/components/nunews"
import { HiBars3 } from "react-icons/hi2";
import Sidebar from "@/components/side"
import { Drawer, DrawerContent, Button, useDisclosure } from "@heroui/react";
import { clearAllCache } from '@/utils/cache';
import Loader from "@/components/loader";
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useSession, signIn } from "next-auth/react";


const Home = () => {
  const [footerText, setFooterText] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { settingsHaveChanged, resetSettingsChanged } = useSettings();
  const { isLoading: globalLoading } = useLoading();
  const { data: session, status } = useSession();

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

  useEffect(() => {
    setFooterText(getRandomText());
  }, []);

  const showFullPageLoader = status === "loading" || (status === "authenticated" && globalLoading);

  return (
    <div className={`flex flex-col min-h-screen ${status === "unauthenticated" ? "bg-teal-400" : ""}`}>
      <Head>
        <title>Genki Today!</title>
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
      </Head>
      {status === "authenticated" && (
        <header className="z-30 flex fixed left-0 shadow-md border-white top-0 items-center justify-center w-screen h-20 bg-teal-400">
          <div className="text-5xl p-4 text-white font-yellow">
            Genki Today!
          </div>

          <Button isIconOnly variant="light" className='absolute right-2 md:right-8' onPress={onOpen}>
            <HiBars3 className='text-white w-7 h-7' />
          </Button>

        </header>
      )}
      <main className={`flex-grow ${status === "authenticated" ? "pt-20" : ""}`}>

        <AnimatePresence>
          {showFullPageLoader && (
            <motion.div
              key="fullpage-loader"
              className="fixed inset-0 flex items-center justify-center bg-white z-50"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Loader />
            </motion.div>
          )}
        </AnimatePresence>

        {status === "loading" ? (

          <div className="h-full"></div>
        ) : status === "authenticated" ? (

          <>
            <News />
            <Drawer
              isOpen={isOpen}
              onOpenChange={(newOpenState) => {
                if (!newOpenState) {
                  if (settingsHaveChanged) {
                    clearAllCache();
                  //  console.log('Cache cleared due to settings changes');

                    if (typeof window !== 'undefined' && window.refreshNewsArticles) {
                      window.refreshNewsArticles();
                    }

                    resetSettingsChanged();
                  } else {
                   // console.log('No changes made, cache preserved');
                  }
                }
                onOpenChange(newOpenState);
              }}
            >
              <DrawerContent className="flex bg-stone-50 h-screen p-0">
                {(onClose) => (
                  <Sidebar />
                )}
              </DrawerContent>
            </Drawer>
          </>
        ) : (

          <motion.div
            className="flex flex-col items-center justify-center w-full h-full mt-8 p-12"
            initial={{ opacity: 0, scale: .9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center max-w-2xl bg-white rounded-3xl p-8 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold  mb-6">
                Welcome to <p className="text-5xl pt-2 md:text-6xl font-yellow text-teal-400">Genki Today!</p>
              </h1>
              <p className="text-xl  mb-5">
                A more positive and mindful news experience
              </p>
              <p className="text-base text-gray-600 mb-3">
                Sign in to get started!
              </p>

              <div className="flex sm:flex-col flex-row gap-4 justify-center">
                <div className="flex flex-col gap-3">
                  <Button
                    onPress={() => signIn("github")}
                    size="lg"
                    endContent={<FaGithub />}
                    className=" bg-gray-800 text-white "
                  >
                    Sign in with GitHub
                  </Button>
                  <Button
                    onPress={() => signIn("google")}
                    size="lg"
                    endContent={<FaGoogle />}
                    className="text-white bg-blue-600 "
                  >
                    Sign in with Google
                  </Button>
                </div>


              </div>
            </div>
          </motion.div>
        )}
      </main>

      {status === "authenticated" && (
        <footer className='flex text-white items-center justify-center h-32 w-full bg-teal-400 flex-shrink-0'>
          <div className='text-base md:text-xl p-4 font-bold text-center'>
            {footerText}
          </div>
        </footer>
      )}
    </div>
  );
};

export default Home;