import { GetStaticPaths } from "next";
import { MdxRemote } from "next-mdx-remote/types";
import { fetchPostContent, getStaticPropsForItem } from "../../lib/posts";
import { parseISO } from "date-fns";
import PostLayout from "../../components/PostLayout";
import { hydrateSource } from "../../lib/mdx-helper";
import { InferGetStaticPropsType } from "next";

export type Props = {
  title: string;
  dateString: string;
  slug: string;
  tags: string[];
  author: string;
  description?: string;
  source: MdxRemote.Source;
};

export default function Post({
  title,
  date,
  slug,
  tags,
  author,
  description = "",
  source,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchPostContent().map((it) => "/posts/" + it.slug);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = getStaticPropsForItem;
