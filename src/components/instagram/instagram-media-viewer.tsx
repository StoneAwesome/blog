import { InstagramPost } from "@lib/instagram";
import * as React from "react";
import ImageGallery from "react-image-gallery";

export type InstagramMediaViewerProps = {
  post: InstagramPost;
};

interface GalleryState {
  currentIndex: number;
  thumbsTranslate: number;
  thumbsSwipedTranslate: number;
  currentSlideOffset: number;
  galleryWidth: number;
  thumbnailsWrapperWidth: number;
  thumbnailsWrapperHeight: number;
  thumbsStyle: ThumbsStyle;
  isFullscreen: boolean;
  isSwipingThumbnail: boolean;
  isPlaying: boolean;
  gallerySlideWrapperHeight: number;
}

export interface ThumbsStyle {
  transition: string;
}

const InstagramMediaViewer: React.FC<InstagramMediaViewerProps> = ({ post }) => {
  const galleryRef = React.useRef<ImageGallery>(null);
  const state = galleryRef.current?.state as GalleryState | undefined;

  if (post.mediaType === "CAROUSEL_ALBUM" && post.images && post.images.length > 0) {
    return (
      <div>
        <ImageGallery
          items={post.images.map((c) => ({ original: c.url }))}
          showPlayButton={false}
          showBullets={false}
          showThumbnails={false}
          useBrowserFullscreen={false}
          onClick={() => {
            if (galleryRef.current) {
              if (!state?.isFullscreen) {
                galleryRef.current.fullScreen();
              }
            }
          }}
          ref={galleryRef}
        />
      </div>
    );
  } else if (post.mediaType === "IMAGE" && post.images.length > 0) {
    return <img src={post.images?.[0].url} className={"img-fluid"} />;
  } else return null;
};

export default InstagramMediaViewer;
