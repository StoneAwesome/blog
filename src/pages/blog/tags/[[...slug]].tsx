import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import TagPostList from "@components/post/tag-post-list";
import {
  BLOG_POST_PAGE_SIZE,
  getStaticPathsForBlogPostsByTag,
} from "@lib/posts";
import StoryBlokClient, { IBlogStoryMeta } from "@lib/storyblok-client";
import { CollectionHelper } from "@lib/collection-helper";

type Props = {
  posts: IBlogStoryMeta[];
  tag: string;
  page?: string | null;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ posts, tag, pagination, page }: Props) {
  const url = `/blog/tags/${tag}` + (page ? `/${page}` : "");
  const title = `Stone inspiration that contains ${tag} stones`;
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <TagPostList posts={posts} tag={tag} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const queries = params?.slug as string[];
  const [slug, page] = [queries[0], queries[1]];

  const pageNum = parseInt(page) || 1;
  const posts = await StoryBlokClient.grabBlogStoriesByTag(
    slug,
    pageNum,
    BLOG_POST_PAGE_SIZE,
    true
  );
  const pages = CollectionHelper.GetTotalPageCount(
    posts?.total || 1,
    BLOG_POST_PAGE_SIZE
  );

  return {
    props: {
      pagination: {
        current: pageNum,
        pages: pages,
      },
      posts: posts?.stories || [],
      tag: slug,
      page: page || null,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getStaticPathsForBlogPostsByTag();

  return {
    paths: result,
    fallback: false,
  };
};
