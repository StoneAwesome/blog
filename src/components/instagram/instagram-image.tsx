import type { StoredInstagramImage } from "@lib/instagram";
import * as React from "react";
import NextImage from "next/image";
import {
  buildInstagramThumbnailBlurImage,
  buildSquareThumbnailImage,
} from "@lib/image-service";

export type InstagramImageProps = {
  image: StoredInstagramImage;
  instagramId: string;
  className?: string;
  alt?: string;
};

const InstagramImage: React.FC<InstagramImageProps> = (props) => {
  return (
    <NextImage
      src={props.image.id}
      className="rounded"
      loader={(loaderProps) => buildSquareThumbnailImage(loaderProps.src, loaderProps.width)}
      alt={props.alt || "Image"}
      height={420}
      width={420}
      placeholder={"blur"}
      layout="responsive"
      blurDataURL={buildInstagramThumbnailBlurImage(props.image.id, 420)}
    />
  );
};

export default InstagramImage;
