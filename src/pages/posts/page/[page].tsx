import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/BasicMeta";
import OpenGraphMeta from "@components/meta/OpenGraphMeta";
import TwitterCardMeta from "@components/meta/TwitterCardMeta";
import PostList from "@components/post/post-list";
import { createPostList, createPostListPaths, PostContent } from "@lib/posts";
import { TagContent } from "@lib/tags";

type Props = {
  posts: Readonly<PostContent>[];
  tags: TagContent[];
  page: number;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Page({ posts, tags, pagination, page }: Props) {
  const url = `/posts/page/${page}`;
  const title = "All posts";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = createPostList;

export const getStaticPaths: GetStaticPaths = createPostListPaths();
