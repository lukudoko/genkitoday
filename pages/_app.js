import '@/styles/globals.css'; // Import global styles
import { useEffect } from 'react'; // Import useEffect for client-side effects
import { Noto_Sans_JP, Yellowtail } from 'next/font/google';

const noto = Noto_Sans_JP({
  weight: "variable",
  subsets: ['latin'],
  variable: '--font-noto-jp',
  display: 'swap',
  adjustFontFallback: false,
});

const yellowtail = Yellowtail({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-yellowtail',
});

export default function App({ Component, pageProps }) {

  useEffect(() => {
    const setThemeColor = (color) => {
      let themeMetaTag = document.querySelector('meta[name="theme-color"]');
      if (!themeMetaTag) {
        themeMetaTag = document.createElement('meta');
        themeMetaTag.name = "theme-color";
        document.head.appendChild(themeMetaTag);
      }
      themeMetaTag.setAttribute("content", color);
    };

    // Reset theme color when app regains focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setThemeColor('#2DD4BF'); // Your desired theme color
      }
    };

    // Initial theme color set
    setThemeColor('#2DD4BF');

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('load', () => setThemeColor('#2DD4BF'));

    // Cleanup listeners on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('load', () => setThemeColor('#2DD4BF'));
    };
  }, []);

  return (
    <main className={`min-h-dvh ${noto.variable} ${yellowtail.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
