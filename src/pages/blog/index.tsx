import * as React from "react";
import type { GetStaticProps } from "next";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import StoryBlokClient from "@lib/storyblok/storyblok-blog-client";
import PostList from "@components/post/post-list";
import { BLOG_POST_PAGE_SIZE } from "@lib/posts";
import { CollectionHelper } from "@lib/collection-helper";
import BasicContainer from "@components/basic/basic-container";
import Pagination from "@components/basic/pagination";

export type BlogIndexPageProps = {
  posts: Awaited<ReturnType<typeof StoryBlokClient.grabBlogMeta>>;
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
      <BasicContainer>
        {/* <div className="my-5 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            StoneAweome Blog
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            {"Collections and information from around the Stone & Tile world."}
          </p>
        </div> */}
        <PostList posts={props.posts?.stories || []} />
        <Pagination
          {...props.pages}
          link={{
            href: (page) => (page === 1 ? "/blog" : "/blog/page/[page]"),
            as: (page) => (page === 1 ? "" : "/blog/page/" + page),
          }}
        />
      </BasicContainer>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<BlogIndexPageProps> = async (
  ctx
) => {
  const posts = await StoryBlokClient.grabBlogMeta(1, BLOG_POST_PAGE_SIZE);
  const totalPage = CollectionHelper.GetTotalPageCount(
    posts?.total || 1,
    BLOG_POST_PAGE_SIZE
  );
  posts?.total;

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
