import Script from "next/script";
import * as React from "react";
import { PostBody } from "@components/post/post-layout";
import type { PreviewTemplateComponentProps, CmsWidgetControlProps } from "netlify-cms-core";
import { remark } from "remark";
import html from "remark-html";
import { parseISO } from "date-fns";
import { PostPageProps } from "@pages/posts/[slug]";
import useSWR from "swr";
import InstagramAPI, { InstagramMedia } from "@lib/instagram-service";
import { useCollapsePanel } from "@hooks/use-collapse-panel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/pro-duotone-svg-icons";
import DateView from "@components/basic/date-view";
import { InstagramPost, StoredInstagramImage } from "@lib/instagram";
import { InstagramBody } from "@components/instagram/instagram-layout";
import { InstagramPageProps } from "@pages/instagram/[slug]";

export function safeGet<TProps>(entry: PreviewTemplateComponentProps["entry"]) {
  return <TKey extends keyof TProps>(key: TKey, emptyValue: TProps[TKey]) => {
    const value = entry.getIn(["data", key]) as TProps[TKey];

    return value || emptyValue;
  };
}

export function useRemark(entry: PreviewTemplateComponentProps["entry"]) {
  const [data, set_data] = React.useState<string | null>(null);
  const htmlString = entry.getIn(["data", "body"]);

  React.useEffect(() => {
    remark()
      .use(html, { allowDangerousHtml: true, allowParseErrors: true })
      .process(htmlString)
      .then((result) => {
        console.log("Changed");
        set_data(
          result.toString().replaceAll(/<img ()src/gi, `<img class="img-fluid rounded " src$1`)
        );
      });
  }, [htmlString]);

  return <div dangerouslySetInnerHTML={{ __html: data || "" }}></div>;
}
