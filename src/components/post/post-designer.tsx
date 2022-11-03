import SocialLink from "@components/social-link";
import { useLinkUtm } from "@lib/mdx-helper";
import { IDesigner } from "@lib/storyblok-client";
import Link from "next/link";
import * as React from "react";

export type DesignerProps = {
  designer?: IDesigner;
};

const Designer: React.FC<DesignerProps> = (props) => {
  const designer = props.designer;

  if (!designer) return null;

  return (
    <div className="flex flex-col border-t pt-4">
      <div className="flex items-center gap-3">
        <span className="text-sm">{`Design by `}</span>
        {designer.website?.url ? (
          <UtmLink href={designer?.website.url}>{designer.name}</UtmLink>
        ) : (
          <span>{designer.name}</span>
        )}
        {designer.instagram_id && (
          <SocialLink handle={designer.instagram_id} service={"instagram"} />
        )}
        {designer.facebook_id && (
          <SocialLink handle={designer.facebook_id} service={"facebook"} />
        )}
      </div>
    </div>
  );
};

const UtmLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (
  props
) => {
  const { href, children, ...other } = props;
  const url = useLinkUtm(href);

  return (
    <Link href={url} {...other}>
      {children}
    </Link>
  );
};

export default Designer;
