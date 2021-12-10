import * as React from "react";
import DateView from "@components/basic/date-view";
import { faExternalLink } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCollapsePanel } from "@hooks/use-collapse-panel";
import { InstagramPost, StoredInstagramImage } from "@lib/instagram";
import InstagramAPI, { InstagramMedia } from "@lib/instagram-service";
import { parseISO } from "date-fns";
import useSWR from "swr";
import type { CmsWidgetControlProps } from "netlify-cms-core";
import { grabAllFileNamesForCollection } from "@lib/content-backend";
import { toDictionary } from "@lib/array-utils";

const instagramClient = new InstagramAPI();
export const CURRENT_INSTAGRAM_ID_FIELD_ID = "instagram_current_field_value";

export const INSTAGRAM_POST_SELECTED_EVENT = "instagram_post_selected";

const InstagramSelector: React.FC<CmsWidgetControlProps<InstagramPost>> = (props) => {
  const { data: recentPosts } = useSWR(`RECENT_INSTAGRAM_POSTS`, () =>
    instagramClient.getAllPosts()
  );

  const { data = [] } = useSWR(
    `RECENT_INSTAGRAM_POSTS_${props.value?.id}_${JSON.stringify(recentPosts)}`,
    async () => {
      if (recentPosts) {
        const currentFileNames = await grabAllFileNamesForCollection("instagram");

        const dictionary = toDictionary(currentFileNames, (d) => d);

        return recentPosts.filter((p) => !dictionary[p.id] || props.value?.id === p.id);
      }
      return [];
    }
  );

  const { onClick, panelRef, isCollapsed } = useCollapsePanel(true);
  const [isLoading, set_isLoading] = React.useState<boolean>(false);

  const selected = React.useMemo(() => {
    if (!props.value) return null;

    const selectedId = props.value?.id || Object.fromEntries(props.value as any)?.id;
    const selected = data ? data.find((d) => d.id === selectedId) : null;

    return selected;
  }, [props.value, data]);

  if (isLoading) {
    return <div>{"Loading . . . "}</div>;
  }

  return (
    <div className={"pt-2 d-flex flex-column gap-2"}>
      <input type={"hidden"} value={props.value?.id || ""} id={CURRENT_INSTAGRAM_ID_FIELD_ID} />
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
                onClick={(e) => {
                  onClick();
                  set_isLoading(true);
                  instagramClient.getPost(d.id).then((fullPost) => {
                    if (fullPost) {
                      fetch(`/api/folder?instagram_id=${d.id}`, { method: "DELETE" })
                        .then(() =>
                          persistInstagram(fullPost).then((r) => {
                            props.onChange(r);
                            document.dispatchEvent(
                              new CustomEvent(INSTAGRAM_POST_SELECTED_EVENT, { detail: r })
                            );
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
    primaryMedia: {
      height: 0,
      width: 0,
      id: "",
      url: "",
    },
  };

  if (media.media_type === "CAROUSEL_ALBUM" && media.children) {
    //-- Grab Children Images
    for (let i = 0; i < media.children.length; i++) {
      const url = media.children[i].media_url;
      const uploadResult = await uploadImage(url, media.id);
      result.images.push(uploadResult);
      //-- Check if this should be the primary url
      if (url === media.media_url) {
        result.primaryMedia = uploadResult;
      }
    }
  } else {
    const uploadedImage = await uploadImage(media.media_url, media.id);
    result.images.push(uploadedImage);
    result.primaryMedia = uploadedImage;
  }

  //-- Ensure Primary Media is set
  if (result.primaryMedia.height === 0) {
    result.primaryMedia = result.images[0];
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

export default InstagramSelector;
