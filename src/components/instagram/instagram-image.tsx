import type { StoredInstagramImage } from "@lib/instagram";
import * as React from "react";
import NextImage from "next/image";
import {
  buildInstagramThumbnailBlurImage,
  createCloudinaryRelativeUrl,
  isCloudinaryUrl,
} from "@lib/image-service";

export type InstagramImageProps = {
  image: StoredInstagramImage;
  instagramId: string;
  className?: string;
  alt?: string;
};


const InstagramImage: React.FC<InstagramImageProps> = (props) => {
  const isCloudUrl = isCloudinaryUrl(props.image.url);

  return isCloudUrl ? (
    <NextImage
      className={props.className || "img-fluid rounded"}
      src={createCloudinaryRelativeUrl(props.image.url)}
      alt={props.alt || "Image"}
      height={props.image.height}
      width={props.image.width}
      placeholder={"blur"}
      layout="responsive"
      blurDataURL={buildInstagramThumbnailBlurImage(props.image.id)}
    />
  ) : (
    <img
      className={props.className || "img-fluid rounded"}
      src={props.image.url}
      alt={props.alt || "Image"}
      height={props.image.height}
      width={props.image.width}
    />
  );
};

export default InstagramImage;
