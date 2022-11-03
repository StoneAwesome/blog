import InstagramEmbed from "react-instagram-embed";
import { TwitterTweetEmbed } from "react-twitter-embed";
import YouTube from "react-youtube";
import hydrate from "next-mdx-remote/hydrate";
import type { MdxRemote } from "next-mdx-remote/types";
import React, { useEffect } from "react";
import { addUtmParamsToUrl, UtmProps } from "./uri";
import SocialLink from "@components/social-link";
import MDXImage from "@components/mdx/mdx-image";

export const BlogImage: React.FC<any> = (props) => {
  if (props.title !== undefined) {
    return (
      <figure>
        <MDXImage {...props} />
        <figcaption className={"text-center"}>{props.title}</figcaption>
      </figure>
    );
  } else {
    return <MDXImage {...props} />;
  }
};

export function useLinkUtm(href: string | undefined) {
  const [utmProps, set_utmProps] = React.useState<Partial<UtmProps>>({
    utm_source: "StoneAwesome",
    utm_medium: "web",
  });

  useEffect(() => {
    if (window !== undefined) {
      set_utmProps({
        ...utmProps,
        utm_content: location.href,
      });
    }
  }, []);

  const url = React.useMemo(
    () =>
      href && !/(stoneawesome\.com|localhost)/i.exec(href)
        ? addUtmParamsToUrl(href, utmProps)
        : href,
    [href, utmProps]
  );

  return url || "";
}

const MDXLink: React.FC<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = (props) => {
  const { children, href, ...rest } = props;
  const url = useLinkUtm(href);

  // if (!url && typeof children === "string" && children?.indexOf("##") === 0) {
  //   return (
  //     <Link href={`/posts/tags/${children.substring(2)?.toLowerCase()}`}>
  //       <a>{children.substring(1)}</a>
  //     </Link>
  //   );
  // }

  return (
    <a {...rest} href={url}>
      {children}
    </a>
  );
};

export const MDX_Components: MdxRemote.Components = {
  InstagramEmbed,
  YouTube,
  TwitterTweetEmbed,
  img: BlogImage,
  a: MDXLink,
  SocialLink,
} as any;
export function hydrateSource(source: MdxRemote.Source) {
  return hydrate(source, { components: MDX_Components });
}
