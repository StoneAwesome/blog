import { createPostItemPaths, getStaticPropsForItem } from "@lib/posts";
import PostLayout from "@components/post/post-layout";
import { hydrateSource } from "@lib/mdx-helper";
import { InferGetStaticPropsType } from "next";
import renderToString from "next-mdx-remote/render-to-string";

export type PostPageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Post(props: PostPageProps) {
  const { source, ...post } = props;
  const content = hydrateSource(source);
  return <PostLayout post={post}>{content}</PostLayout>;
}

export const getStaticPaths = createPostItemPaths();

export const getStaticProps = getStaticPropsForItem(renderToString);
