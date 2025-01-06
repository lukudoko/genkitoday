import { useEffect, useState } from 'react';
import Head from 'next/head';
import News from "@/components/layout"

const Home = () => {
  const [articles, setArticles] = useState([]);
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

  useEffect(() => {

    setFooterText(getRandomText());

  }, []);

  return (
    <>
      <Head>
        <title>Genki Today!</title>
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
      </Head>
      <header className="z-30 flex fixed left-0 top-0 items-center justify-center w-screen h-20 bg-teal-400">
        <div className="text-5xl p-4 text-white font-yellow">
          Genki Today!
        </div>
      </header>
      <main>
        <News />
      </main>
      <footer className='flex font-sans text-white items-center justify-center h-32 w-full bg-teal-400'>
        <div className='text-xl p-4 font-bold text-center'>
          {footerText}
        </div>
      </footer>
    </>
  );
};

export default Home;
