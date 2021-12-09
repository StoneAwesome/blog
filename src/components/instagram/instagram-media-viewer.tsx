import { InstagramMedia } from "@lib/instagram-service";
import * as React from "react";
import ImageGallery from "react-image-gallery";

export type InstagramMediaViewerProps = {
  post: InstagramMedia;
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

  if (post.media_type === "CAROUSEL_ALBUM" && post.children && post.children.length > 0) {
    return (
      <div>
        <ImageGallery
          items={post.children.map((c) => ({ original: c.media_url }))}
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
  } else if (post.media_type === "IMAGE") {
    return <img src={post.media_url} className={"img-fluid"} />;
  } else return null;
};

export default InstagramMediaViewer;
