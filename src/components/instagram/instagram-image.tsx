import type { StoredInstagramImage } from "@lib/instagram";
import * as React from "react";
import NextImage from "next/image";
import {
  buildInstagramThumbnailBlurImage,
  buildSquareThumbnailImage,
} from "@lib/image-service";
import { useBootstrapBreaksDown } from "@hooks/use-media";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleVerticalHistory } from "@fortawesome/pro-solid-svg-icons";

export type InstagramImageProps = {
  image: StoredInstagramImage;
  hasMultipleImages?: boolean;
  instagramId: string;
  className?: string;
  alt?: string;
};

const InstagramImage: React.FC<InstagramImageProps> = (props) => {
  const size = useBootstrapBreaksDown(
    ["md", "lg", "xl", "xxl"],
    [135, 164, 317, 336],
    238
  );

  return (
    <>
      <NextImage
        src={props.image.id}
        className="w-full object-cover"
        loader={(loaderProps) =>
          buildSquareThumbnailImage(loaderProps.src, loaderProps.width)
        }
        alt={props.alt || "Image"}
        placeholder={"blur"}
        width={size}
        height={size * 0.8}
        blurDataURL={buildInstagramThumbnailBlurImage(props.image.id, size)}
        sizes={"30vw"}
      />
      {props.hasMultipleImages ? (
        <FontAwesomeIcon
          icon={faRectangleVerticalHistory}
          className={
            "absolute right-0 top-0 mr-3 mt-3  text-xs text-white/90 md:text-sm"
          }
          flip="horizontal"
        />
      ) : null}
    </>
  );
};

export default InstagramImage;
