import { InstagramPost } from "@lib/instagram";
import * as React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { useMasonryLayout } from "@hooks/use-masonry-layout";
//import "photoswipe/dist/default-skin/default-skin.css";

export type InstagramMediaViewerProps = {
  post: InstagramPost;
};

export interface ThumbsStyle {
  transition: string;
}

const InstagramMediaViewer: React.FC<InstagramMediaViewerProps> = ({ post }) => {
  const masonry = useMasonryLayout(post.images, {
    columns: 2,
  });
  if (
    (post.mediaType === "CAROUSEL_ALBUM" || post.mediaType === "IMAGE") &&
    post.images &&
    post.images.length > 0
  ) {
    const len = post.images.length;
    return (
      <>
        <Gallery>
          <div className={`gap-3 ${masonry.parentClass}`}>
            {post.images.map((i, idx, all) => (
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
                    className={`object-cover rounded cursor-pointer shadow hover:shadow-lg hover:shadow-_bsInfo/50  transition-shadow duration-300  h-[8rem] md:h-[12rem] w-full ${masonry.getChildClass(
                      idx
                    )}`}
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
