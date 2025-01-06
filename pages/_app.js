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

  return (
    <main className={`min-h-dvh ${noto.variable} ${yellowtail.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
