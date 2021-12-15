import type { StoredInstagramImage } from "@lib/instagram";
import * as React from "react";
import NextImage from "next/image";
import { buildInstagramThumbnailBlurImage, buildSquareThumbnailImage } from "@lib/image-service";
import { useBootstrapBreaksDown } from "@hooks/use-media";

export type InstagramImageProps = {
  image: StoredInstagramImage;
  instagramId: string;
  className?: string;
  alt?: string;
};

const InstagramImage: React.FC<InstagramImageProps> = (props) => {
  const size = useBootstrapBreaksDown(["md", "lg", "xl", "xxl"], [135, 164, 224, 238], 238);

  return (
    <NextImage
      src={props.image.id}
      className=""
      loader={(loaderProps) => buildSquareThumbnailImage(loaderProps.src, loaderProps.width)}
      alt={props.alt || "Image"}
      height={size}
      width={size}
      placeholder={"blur"}
      layout="responsive"
      blurDataURL={buildInstagramThumbnailBlurImage(props.image.id, size)}
    />
  );
};

export default InstagramImage;
