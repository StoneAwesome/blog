import { InstagramPost } from "@lib/instagram";
import * as React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

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

  if (
    (post.mediaType === "CAROUSEL_ALBUM" || post.mediaType === "IMAGE") &&
    post.images &&
    post.images.length > 0
  ) {
    return (
      <ImageGallery
        items={post.images.map((c) => ({ original: c.url }))}
        showPlayButton={false}
        showBullets={false}
        showThumbnails={false}
        useBrowserFullscreen={false}
        additionalClass={"w-full"}
        onClick={() => {
          if (galleryRef.current) {
            if (!state?.isFullscreen) {
              galleryRef.current.fullScreen();
            }
          }
        }}
        ref={galleryRef}
      />
    );
  } else return null;
};

export default InstagramMediaViewer;
