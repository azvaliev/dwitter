import { type AppType } from "next/dist/shared/lib/utils";

import "src/styles/globals.css";

import { Inter, Source_Sans_Pro } from '@next/font/google'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

const sourceSansPro = Source_Sans_Pro({
  variable: '--font-source-sans-pro',
  weight: ["200", "300", "400"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>{`
        * { font-family: ${sourceSansPro.style.fontFamily}; color: white; }
        :is(h1, h2, h3, h4, h5, h6), :is(h1, h2, h3, h4, h5, h6) * { font-family: ${inter.style.fontFamily}; }
      `}</style>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
