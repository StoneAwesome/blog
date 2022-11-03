import * as React from "react";
import type { GetStaticProps } from "next";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import StoryBlokClient from "@lib/storyblok-client";
import PostList from "@components/post/post-list";
import { BLOG_POST_PAGE_SIZE } from "@lib/posts";
import { CollectionHelper } from "@lib/collection-helper";

export type BlogIndexPageProps = {
  posts: Awaited<ReturnType<typeof StoryBlokClient.grabStoryBlokBlogMeta>>;
  pages: {
    current: number;
    pages: number;
  };
};

const BlogIndexPage: React.FC<BlogIndexPageProps> = (props) => {
  const url = "/blog";
  const title = "StoneAwesome Blog";

  return (
    <Layout>
      <BasicMeta url={"/blog"} title={"StoneAwesome Blog"} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <PostList pagination={props.pages} posts={props.posts?.stories || []} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<BlogIndexPageProps> = async (
  ctx
) => {
  const posts = await StoryBlokClient.grabStoryBlokBlogMeta(
    1,
    BLOG_POST_PAGE_SIZE,
    true
  );
  const totalPage = CollectionHelper.GetTotalPageCount(
    posts?.total || 1,
    BLOG_POST_PAGE_SIZE
  );

  return {
    props: {
      posts: posts,
      pages: {
        current: 1,
        pages: totalPage,
      },
    },
  };
};

export default BlogIndexPage;
