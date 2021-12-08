import Head from "next/head";
import React from "react";
import NavHeader from "./nav-header";
import { SocialList } from "./social-list";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <div className="root">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <nav>
        <NavHeader />
      </nav>
      <main>{children}</main>
      <footer className="p-3 p-md-5 mt-5 text-center text-muted bg-light border-top">
        <div className="container">
          <SocialList />
          <p className="mb-0 ">
            Curated with ♥ by the <b>StoneAwesome</b> team with the help of <b>designers</b> and{" "}
            <b>builders</b> everywhere!
          </p>
        </div>
      </footer>
    </div>
  );
}
