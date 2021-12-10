import type { StoredInstagramImage } from "@lib/instagram";
import * as React from "react";

export type InstagramImageProps = {
  image: StoredInstagramImage;
  className?: string;
  alt?: string;
};

const InstagramImage: React.FC<InstagramImageProps> = (props) => {
  return (
    <img
      className={props.className || "img-fluid rounded"}
      src={props.image.url}
      alt={props.alt || "Image"}
    />
  );
};

export default InstagramImage;
