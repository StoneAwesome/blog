import { createInstagramItemPaths, getInstagramItemProps } from "@lib/instagram";
import { hydrateSource } from "@lib/mdx-helper";
import InstagramLayout from "@components/instagram/instagram-layout";
import { InferGetStaticPropsType } from "next";
import renderToString from "next-mdx-remote/render-to-string";

type InstagramPageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Instagram(props: InstagramPageProps) {
  const content = hydrateSource(props.source);
  return <InstagramLayout {...props}>{content}</InstagramLayout>;
}

export const getStaticPaths = createInstagramItemPaths("instagram");

export const getStaticProps = getInstagramItemProps(renderToString);
