import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import config from "@lib/config";
import {
  countInstagram,
  InstagramContent,
  listInstagramContent,
} from "@lib/instagram";
import { getTag, listTags, TagContent } from "@lib/tags";
import InstagramTagList from "@components/instagram/instagram-Tag-list";

type Props = {
  posts: InstagramContent[];
  tag: TagContent;
  page?: string;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ posts, tag, pagination, page }: Props) {
  const url = `/instagram/tags/${tag.name}` + (page ? `/${page}` : "");
  const title = tag.name;
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <InstagramTagList posts={posts} tag={tag} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queries = params?.slug as string[];
  const [slug, page] = [queries[0], queries[1]];
  const posts = await listInstagramContent(
    page ? parseInt(page as string) : 1,
    config.posts_per_page,
    slug
  );
  const tag = getTag(slug);
  const pagination = {
    current: page ? parseInt(page as string) : 1,
    pages: Math.ceil((await countInstagram(slug)) / config.posts_per_page),
  };
  const props: {
    posts: InstagramContent[];
    tag: TagContent;
    pagination: { current: number; pages: number };
    page?: string;
  } = { posts, tag, pagination };
  if (page) {
    props.page = page;
  }
  return {
    props,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = listTags();

  const pathsForTag = await Promise.all(
    allTags.map(async (tag) => {
      const pages = Math.ceil(
        (await countInstagram(tag.slug)) / config.posts_per_page
      );
      return Array.from(Array(pages).keys()).map((page) =>
        page === 0
          ? {
              params: { slug: [tag.slug] },
            }
          : {
              params: { slug: [tag.slug, (page + 1).toString()] },
            }
      );
    })
  );

  const paths = pathsForTag.flatMap((i) => i);

  return {
    paths: paths,
    fallback: false,
  };
};
