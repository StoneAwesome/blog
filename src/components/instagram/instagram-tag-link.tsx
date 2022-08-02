import Link from "next/link";
import * as React from "react";

export interface ITag {
  tag: string;
  type: "material" | "tag";
}
export type InstagramMaterialLinkProps = {
  tag: ITag;
  className?: string;
};

const InstagramTagLink: React.FC<InstagramMaterialLinkProps> = (props) => {
  const { tag, type } = props.tag || {};
  return (
    <Link href={`/instagram/tags/${tag.toLowerCase()}`}>
      <a className={props.className || "blog-link"}>{tag}</a>
    </Link>
  );
};

export default InstagramTagLink;
