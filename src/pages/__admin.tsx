import Script from "next/script";
import * as React from "react";
import { PostBody } from "../components/PostLayout";
import type { PreviewTemplateComponentProps, CmsWidgetControlProps } from "netlify-cms-core";
import { remark } from "remark";
import html from "remark-html";
import { parseISO } from "date-fns";
import { PostPageProps } from "./posts/[slug]";
import useSWR from "swr";
import InstagramAPI from "../lib/instagram-service";
import { useCollapsePanel } from "../hooks/use-collapse-panel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/pro-duotone-svg-icons";
import DateView from "../components/date-view";
export type AdminPageProps = {};

const AdminPage: React.FC<AdminPageProps> = (props) => {
  React.useEffect(() => {
    (async () => {
      import("bootstrap");
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
      CMS.registerWidget("instagram", InstagramSelector);
    })();
  }, []);

  return (
    <div>
      <Script src={"https://identity.netlify.com/v1/netlify-identity-widget.js"} />
    </div>
  );
};

const InstagramSelector: React.FC<CmsWidgetControlProps<string>> = (props) => {
  const { data = [] } = useSWR(`RECENT_INSTAGRAM_POSTS`, async () => {
    const instagramClient = new InstagramAPI();
    return await instagramClient.getRecentPosts();
  });

  const { onClick, panelRef, isCollapsed } = useCollapsePanel(true);

  const selected = data ? data.find((d) => d.id === props.value) : null;

  return (
    <div className={"pt-2 d-flex flex-column gap-2"}>
      {isCollapsed && (
        <button className={"btn btn-primary"} onClick={onClick}>
          {"Select Post"}
        </button>
      )}

      <div>
        {selected && isCollapsed ? (
          <div className={"d-flex gap-2"}>
            <img
              src={selected.thumbnail_url || selected.media_url}
              className={"img-thumbnail"}
              style={{ width: "18rem" }}
            />
            <div>
              <a href={selected.permalink} target={"_blank"}>
                {"View on Instagram"}
                <FontAwesomeIcon icon={faExternalLink} className={"ms-2"} />
              </a>
              <div>
                <DateView date={parseISO(selected.timestamp)} />
              </div>
              <p>{selected.caption}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className={"collapse"} ref={panelRef}>
        <div className={"row border py-1"}>
          {data.map((d) => (
            <div className={"col-4"}>
              <div
                className={`card my-1  ${d.id === props.value ? "border-primary" : ""}`}
                onClick={() => {
                  props.onChange(d.id);
                  onClick();
                }}
              >
                <img src={d.thumbnail_url || d.media_url} className={"card-img-top"} />
                <div className={"card-body border-top"}>
                  <p className={"card-text"}>{`${d.caption?.substr(0, 255)}...`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
