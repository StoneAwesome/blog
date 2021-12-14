import type { StoredInstagramImage } from "@lib/instagram";
import * as React from "react";
import NextImage from "next/image";
import { buildUrl, setConfig } from "cloudinary-build-url";

export type InstagramImageProps = {
  image: StoredInstagramImage;
  instagramId: string;
  className?: string;
  alt?: string;
};

const CLOUDINARY_PREFIX = "https://res.cloudinary.com/stoneawesome/image/upload";
setConfig({
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
});

const InstagramImage: React.FC<InstagramImageProps> = (props) => {
  const isCloudinaryImage = props.image.url.indexOf(CLOUDINARY_PREFIX) === 0;

  return isCloudinaryImage ? (
    <NextImage
      className={props.className || "img-fluid rounded"}
      src={props.image.url.replace(CLOUDINARY_PREFIX, "")}
      alt={props.alt || "Image"}
      height={props.image.height}
      width={props.image.width}
      placeholder={"blur"}
      layout="responsive"
      blurDataURL={buildUrl(props.image.id, {
        transformations: {
          resize: {
            width: 427,
            type: "scale",
          },
          effect: {
            name: "blur",
            value: "400",
          },
        },
      })}
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
