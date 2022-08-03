import Link from "next/link";
import * as React from "react";

export interface ITag {
  tag: string;
  type: "material" | "tag" | "color";
}
export type InstagramMaterialLinkProps = {
  tag: ITag;
  className?: string;
};

const InstagramTagLink: React.FC<InstagramMaterialLinkProps> = (props) => {
  const { tag, type } = props.tag || {};
  if (!tag) return null;
  return (
    <Link href={`/instagram/tags/${tag.toLowerCase()}`}>
      <a className={props.className || "blog-link"}>{tag}</a>
    </Link>
  );
};

export default InstagramTagLink;
