import { AppProps } from "next/app";
import "../styles/app.css";
import Head from "next/head";
import Analytics from "@components/analytics";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/fav/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <Analytics />
      <Component {...pageProps} />
    </>
  );
}
