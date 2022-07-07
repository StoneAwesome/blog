import type { StoredInstagramImage } from "@lib/instagram";
import * as React from "react";
import NextImage from "next/future/image";
import { buildInstagramThumbnailBlurImage, buildSquareThumbnailImage } from "@lib/image-service";
import { useBootstrapBreaksDown } from "@hooks/use-media";

export type InstagramImageProps = {
  image: StoredInstagramImage;
  instagramId: string;
  className?: string;
  alt?: string;
};

const InstagramImage: React.FC<InstagramImageProps> = (props) => {
  const size = useBootstrapBreaksDown(["md", "lg", "xl", "xxl"], [135, 164, 317, 336], 238);

  return (
    <NextImage
      src={props.image.id}
      className="rounded w-full object-cover"
      loader={(loaderProps) => buildSquareThumbnailImage(loaderProps.src, loaderProps.width)}
      alt={props.alt || "Image"}
      placeholder={"blur"}
      width={size}
      height={size * 0.8}
      blurDataURL={buildInstagramThumbnailBlurImage(props.image.id, size)}
      sizes={"30vw"}
    />
  );
};

export default InstagramImage;
