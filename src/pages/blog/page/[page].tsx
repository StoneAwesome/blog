import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import PostList from "@components/post/post-list";
import { CollectionHelper } from "@lib/collection-helper";
import { BLOG_POST_PAGE_SIZE, getStaticPathsForBlogPosts } from "@lib/posts";
import StoryBlokClient, { IBlogStoryMeta } from "@lib/storyblok-client";
import type { GetStaticProps, GetStaticPaths } from "next";

type Props = {
  posts: IBlogStoryMeta[];
  page: number;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Page({ posts, pagination, page }: Props) {
  const url = `/blog/page/${page}`;
  const title = "All posts";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <PostList posts={posts} pagination={pagination} />
    </Layout>
  );
}

type ParamsProps = {
  page: string;
};
export const getStaticProps: GetStaticProps<Props, ParamsProps> = async (
  ctx
) => {
  const page = ctx.params?.page;

  if (!page)
    return {
      notFound: true,
    };
  const pageNum = parseInt(page);

  const posts = await StoryBlokClient.grabStoryBlokBlogMeta(
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
      page: pageNum,
      posts: posts?.stories || [],
      pagination: {
        current: pageNum,
        pages: pages,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths<ParamsProps> = async (ctx) => {
  const paths = await getStaticPathsForBlogPosts();
  return {
    paths: paths,
    fallback: "blocking",
  };
};
