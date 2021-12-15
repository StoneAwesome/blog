import { useRouter } from "next/router";
import Script from "next/script";
import * as React from "react";
import Logger from "@lib/logger";
export type AnalyticsProps = {};

const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
const IS_DEBUG = process.env.NEXT_PUBLIC_IS_DEBUG;

function trackPageView(url: string) {
  if (
    typeof gtag === undefined ||
    null === (window as any).gtag ||
    process.env.NEXT_PUBLIC_IS_DEBUG ||
    !GOOGLE_TAG_ID
  ) {
    Logger.Log(`GTAG: page_view`, { url });
  } else {
    // gtag("event", "page_view", {
    //   page_title: document.title,
    //   page_path: router.pathname,
    //   page_location: url,
    // });
    gtag("config", GOOGLE_TAG_ID, {
      page_path: url,
    });
  }
}

const Analytics: React.FC<AnalyticsProps> = (props) => {
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
  return IS_DEBUG ? (
    <></>
  ) : (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        id={"GTAG_SCRIPT"}
      />
      <Script
        id={"GTAG_SETUP"}
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', '${GOOGLE_TAG_ID}');
          `,
        }}
      />
    </>
  );
};

export default Analytics;
