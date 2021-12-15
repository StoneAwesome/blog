import { createPostItemPaths, getStaticPropsForItem } from "@lib/posts";
import { parseISO } from "date-fns";
import PostLayout from "@components/post/post-layout";
import { hydrateSource } from "@lib/mdx-helper";
import { InferGetStaticPropsType } from "next";
import renderToString from "next-mdx-remote/render-to-string";

export type PostPageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Post({
  title,
  date,
  slug,
  tags,
  author,
  description = "",
  source,
}: PostPageProps) {
  const content = hydrateSource(source);
  return (
    <PostLayout
      title={title}
      date={parseISO(date)}
      slug={slug}
      tags={tags}
      author={author}
      description={description}
    >
      {content}
    </PostLayout>
  );
}

export const getStaticPaths = createPostItemPaths();

export const getStaticProps = getStaticPropsForItem(renderToString);
