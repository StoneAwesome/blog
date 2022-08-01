import Link from "next/link";
import * as React from "react";

export type InstagramMaterialLinkProps = {
  material: string;
  className?: string;
};

const InstagramMaterialLink: React.FC<InstagramMaterialLinkProps> = (props) => {
  return (
    <Link href={`/instagram/tags/${props.material.toLowerCase()}`}>
      <a className={props.className || "blog-link"}>{props.material}</a>
    </Link>
  );
};

export default InstagramMaterialLink;
