import InstagramEmbed from "react-instagram-embed";
import { TwitterTweetEmbed } from "react-twitter-embed";
import YouTube from "react-youtube";
import hydrate from "next-mdx-remote/hydrate";
import type { MdxRemote } from "next-mdx-remote/types";

export const MDX_Components = {
  InstagramEmbed,
  YouTube,
  TwitterTweetEmbed,
  img: (props) => {
    if (props.title !== undefined) {
      return (
        <figure className={"figure"}>
          <img {...props} className={"figure-img img-fluid rounded"} />
          <figcaption className={"figure-caption"}>{props.title}</figcaption>
        </figure>
      );
    } else {
      return <img {...props} className={"img-fluid rounded"} />;
    }
  },
  Question: (props) => (
    <p>
      <b>{props.children}</b>
    </p>
  ),
  Answer: (props) => (
    <blockquote className={"ms-4"}>
      <p>
        <i>{props.children}</i>
      </p>
    </blockquote>
  ),
};
export function hydrateSource(source: MdxRemote.Source) {
  return hydrate(source, { components: MDX_Components });
}
