import '@/styles/globals.css'; // Import global styles
import { Noto_Sans_JP, Yellowtail, Lato } from 'next/font/google';

const noto = Noto_Sans_JP({
  weight: "variable",
  subsets: ['latin'],
  variable: '--font-noto-jp',
  display: 'swap',
  adjustFontFallback: false,
});

const lex = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ['latin'],
  variable: '--lexend',
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
    <main className={`${noto.variable} ${lex.variable} ${yellowtail.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

