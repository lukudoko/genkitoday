import '@/styles/globals.css';
import { Noto_Sans_JP, Yellowtail } from 'next/font/google';
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { SettingsProvider } from '@/contexts/settingsContext'; // Add this import
import { LoadingProvider } from '@/contexts/LoadingContext';


const noto = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-jp',
  display: 'swap',
});

const yellowtail = Yellowtail({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-yellowtail',
});

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <HeroUIProvider>
        <SettingsProvider>
          <LoadingProvider>
            <main className={`min-h-dvh ${noto.variable} ${yellowtail.variable} font-noto`}>
              <Component {...pageProps} />
            </main>
          </LoadingProvider>
        </SettingsProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}