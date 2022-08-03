import Head from "next/head";
import React from "react";
import NavHeader from "./nav-header";
import { SocialList } from "./social-list";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen flex-col">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <nav>
        <NavHeader />
      </nav>
      <main>{children}</main>
      <footer className="p-md-5 text-muted border-top mt-auto justify-end border-t bg-_bsLight p-3 text-center">
        <div className="container mx-auto">
          <SocialList />
          <p className="mb-0 ">
            Curated with ♥ by the <b>StoneAwesome</b> team with the help of{" "}
            <b>designers</b> and <b>builders</b> everywhere!
          </p>
        </div>
      </footer>
    </div>
  );
}
