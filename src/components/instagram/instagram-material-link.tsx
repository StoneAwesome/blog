import Link from "next/link";
import * as React from "react";

export type InstagramMaterialLinkProps = {
  material: string;
  classNameOverride?: string;
};

const InstagramMaterialLink: React.FC<InstagramMaterialLinkProps> = (props) => {
  return (
    <Link href={`https://stonetrash.com/search/${props.material}`}>
      <a className={props.classNameOverride || "blog-link"}>{props.material}</a>
    </Link>
  );
};

export default InstagramMaterialLink;
