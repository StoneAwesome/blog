import Script from "next/script";
import * as React from "react";
import { PostBody } from "../components/PostLayout";
import type { PreviewTemplateComponentProps } from "netlify-cms-core";
import { remark } from "remark";
import html from "remark-html";
import { parseISO } from "date-fns";
import { PostPageProps } from "./posts/[slug]";
export type AdminPageProps = {};

const AdminPage: React.FC<AdminPageProps> = (props) => {
  React.useEffect(() => {
    (async () => {
      const CMS = (await import("netlify-cms-app")).default;
      CMS.init();
      const allCss = document.head.getElementsByTagName("style");
      for (let i = 0; i < allCss.length; i++) {
        const s = allCss[i];

        if (s.innerText) {
          CMS.registerPreviewStyle(s.innerText, { raw: true });
        }
      }

      const allLinks = document.head.getElementsByTagName("link");
      for (let i = 0; i < allLinks.length; i++) {
        const l = allLinks[i];
        if (l.getAttribute("as") === "style") {
          CMS.registerPreviewStyle(l.href);
        } else if (l.getAttribute("rel") === "stylesheet") {
          CMS.registerPreviewStyle(l.href);
        }
      }

      CMS.registerPreviewTemplate("posts", Article);
      CMS.registerWidget(
        "instagram",
        (p) => <div>{"My Widget"}</div>,
        (previewProps) => (
          <div>
            <code>
              <pre>{JSON.stringify(previewProps.field)}</pre>
            </code>
          </div>
        )
      );
    })();
  }, []);

  return (
    <div>
      <Script src={"https://identity.netlify.com/v1/netlify-identity-widget.js"} />
    </div>
  );
};

function safeGet(entry: PreviewTemplateComponentProps["entry"]) {
  return <T,>(key: keyof PostPageProps | "body", emptyValue: T) => {
    const value = entry.getIn(["data", key]);

    return value || emptyValue;
  };
}

const Article: React.FC<PreviewTemplateComponentProps> = (props) => {
  const d = safeGet(props.entry);
  const details = d("body", "");

  const [data, set_data] = React.useState(null);

  React.useEffect(() => {
    remark()
      .use(html, { allowDangerousHtml: true, allowParseErrors: true })
      .process(details)
      .then((result) => {
        console.log("Changed");
        set_data(
          result.toString().replaceAll(/<img ()src/gi, `<img class="img-fluid rounded " src$1`)
        );
      });
  }, [details]);

  return (
    <PostBody
      date={parseISO(d("date", "1900-01-01"))}
      slug={d("slug", "")}
      tags={d("tags", [])}
      title={d("title", "")}
      description={d("description", "")}
      author={d("author", "")}
    >
      {data && <div dangerouslySetInnerHTML={{ __html: data }}></div>}
    </PostBody>
  );
};

export default AdminPage;
