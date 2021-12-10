import Script from "next/script";
import * as React from "react";
import { PostBody } from "@components/post/post-layout";
import type { PreviewTemplateComponentProps, CmsWidgetControlProps } from "netlify-cms-core";
import { remark } from "remark";
import html from "remark-html";
import { parseISO } from "date-fns";
import { PostPageProps } from "./posts/[slug]";
import useSWR from "swr";
import InstagramAPI, { InstagramMedia } from "@lib/instagram-service";
import { useCollapsePanel } from "../hooks/use-collapse-panel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/pro-duotone-svg-icons";
import DateView from "@components/basic/date-view";
import { InstagramContent, InstagramPost, StoredInstagramImage } from "@lib/instagram";
import { deleteFolder } from "@lib/cloud-img";
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

const instagramClient = new InstagramAPI();
const InstagramSelector: React.FC<CmsWidgetControlProps<InstagramPost>> = (props) => {
  const { data = [] } = useSWR(`RECENT_INSTAGRAM_POSTS`, async () => {
    return await instagramClient.getRecentPosts();
  });

  const { onClick, panelRef, isCollapsed } = useCollapsePanel(true);
  const [isLoading, set_isLoading] = React.useState<boolean>(false);

  const selected = data ? data.find((d) => d.id === props.value?.id) : null;

  if (isLoading) {
    return <div>{"Loading . . . "}</div>;
  }

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
              <span className="badge bg-dark">{selected.id}</span>
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
                className={`card my-1  ${d.id === props.value?.id ? "border-primary" : ""}`}
                onClick={() => {
                  onClick();
                  set_isLoading(true);
                  instagramClient.getPost(d.id).then((fullPost) => {
                    if (fullPost) {
                      fetch(`/api/folder?instagram_id=${d.id}`, { method: "DELETE" })
                        .then(() =>
                          persistInstagram(fullPost).then((r) => {
                            props.onChange(r);
                          })
                        )
                        .catch((r) => {
                          alert("An Error Occurred");
                          console.log(r);
                        })
                        .finally(() => set_isLoading(false));
                    } else {
                      alert("Could not grab instagram post");
                      set_isLoading(false);
                    }
                  });
                }}
              >
                <img src={d.thumbnail_url || d.media_url} className={"card-img-top"} />
                <div className={"card-body border-top"}>
                  <p className={"card-text"}>{`${d.caption?.substring(0, 255)}...`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

async function persistInstagram(media: InstagramMedia): Promise<InstagramPost> {
  const result: InstagramPost = {
    caption: media.caption,
    id: media.id,
    images: [],
    mediaType: media.media_type,
    permalink: media.permalink,
    timestamp: media.timestamp,
  };

  if (media.media_type === "CAROUSEL_ALBUM" && media.children) {
    console.log("Images");
    //-- Grab Children Images
    for (let i = 0; i < media.children.length; i++) {
      const uploadResult = await uploadImage(media.children[i].media_url, media.id);
      result.images.push(uploadResult);
    }
  } else {
    console.log("Just one", media.media_type);
    const uploadedImage = await uploadImage(media.media_url, media.id);
    result.images.push(uploadedImage);
  }

  return result;
}

async function uploadImage(url: string, instagramId: string) {
  const result = await fetch(`/api/images?url=${encodeURI(url)}&instagram_id=${instagramId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url, instagram_id: instagramId }),
  });
  return (await result.json()) as StoredInstagramImage;
}

function safeGet(entry: PreviewTemplateComponentProps["entry"]) {
  return <T,>(key: keyof PostPageProps | "body", emptyValue: T) => {
    const value = entry.getIn(["data", key]);

    return value || emptyValue;
  };
}

const Article: React.FC<PreviewTemplateComponentProps> = (props) => {
  const d = safeGet(props.entry);
  const details = d("body", "");

  const [data, set_data] = React.useState<string | null>(null);

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
