import InstagramEmbed from "react-instagram-embed";
import { TwitterTweetEmbed } from "react-twitter-embed";
import YouTube from "react-youtube";
import hydrate from "next-mdx-remote/hydrate";
import type { MdxRemote } from "next-mdx-remote/types";
import React, { useEffect } from "react";
import { addUtmParamsToUrl, UtmProps } from "./uri";
import { Item } from "react-photoswipe-gallery";

export const BlogImage: React.FC<any> = (props) => {
  if (props.title !== undefined) {
    return (
      <figure className={"figure"}>
        <MDXImage {...props} />
        <figcaption className={"figure-caption"}>{props.title}</figcaption>
      </figure>
    );
  } else {
    return <MDXImage {...props} />;
  }
};

const MDXImage: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => {
  const [dimensions, set_dimensions] = React.useState<{
    height: number;
    width: number;
  }>();

  if (dimensions) {
    return (
      <Item
        original={props.src}
        thumbnail={props.src}
        width={dimensions.width}
        height={dimensions.height}
        cropped
      >
        {({ ref, open }) => (
          <>
            <img
              ref={ref as React.MutableRefObject<HTMLImageElement>}
              {...props}
              className={
                "max-h-[40vh] w-full cursor-pointer rounded object-cover"
              }
              onClick={open}
            />
          </>
        )}
      </Item>
    );
  }

  return (
    <img
      {...props}
      onLoad={(i) => {
        set_dimensions({
          height: i.currentTarget.naturalHeight,
          width: i.currentTarget.naturalWidth,
        });
      }}
      className={"max-h-[40vh] w-full rounded object-cover"}
    />
  );
};

const MDXLink: React.FC<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = (props) => {
  const { children, href, ...rest } = props;
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

  //-- For outgoing Urls, make sure we tag them with our UTM codes.
  const url = React.useMemo(
    () =>
      href && /(stoneawesome\.com|localhost)/i.exec(href)
        ? addUtmParamsToUrl(href, utmProps)
        : href,
    [href, utmProps]
  );

  return (
    <a {...rest} href={url}>
      {children}
    </a>
  );
};

export const MDX_Components = {
  InstagramEmbed,
  YouTube,
  TwitterTweetEmbed,
  img: BlogImage,
  a: MDXLink,
};
export function hydrateSource(source: MdxRemote.Source) {
  return hydrate(source, { components: MDX_Components });
}
