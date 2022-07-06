import { InstagramPost } from "@lib/instagram";
import * as React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
//import "photoswipe/dist/default-skin/default-skin.css";

export type InstagramMediaViewerProps = {
  post: InstagramPost;
};

export interface ThumbsStyle {
  transition: string;
}

const InstagramMediaViewer: React.FC<InstagramMediaViewerProps> = ({ post }) => {
  if (
    (post.mediaType === "CAROUSEL_ALBUM" || post.mediaType === "IMAGE") &&
    post.images &&
    post.images.length > 0
  ) {
    const len = post.images.length;
    return (
      <>
        <Gallery>
          <div
            className={`p-3 gap-3 grid ${
              len > 4 ? "grid-cols-2" : len % 3 === 0 ? "grid-cols-2" : "grid-cols-1"
            } `}
          >
            {post.images.map((i, idx) => (
              <Item
                key={i.url}
                original={i.url}
                width={i.width}
                height={i.height}
                thumbnail={i.url}
                cropped
              >
                {({ ref, open }) => (
                  <img
                    src={i.url}
                    ref={ref as React.MutableRefObject<HTMLImageElement>}
                    className={`object-cover rounded cursor-pointer shadow-lg hover:ring hover:ring-_bsInfo h-[8rem] md:h-[12rem] w-full ${
                      idx % 3 === 0 || len < 3 ? "col-span-2" : ""
                    }`}
                    onClick={open}
                  />
                )}
              </Item>
            ))}
          </div>
        </Gallery>
      </>
    );
  } else return null;
};

export default InstagramMediaViewer;
