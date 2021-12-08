import React from "react";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/BasicMeta";
import OpenGraphMeta from "@components/meta/OpenGraphMeta";
import TwitterCardMeta from "@components/meta/TwitterCardMeta";
import PostList from "@components/post/post-list";
import { createPostList } from "@lib/posts";
import { InferGetStaticPropsType } from "next";

export default function Index({
  posts,
  tags,
  pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <BasicMeta url={"/"} />
      <OpenGraphMeta url={"/"} />
      <TwitterCardMeta url={"/"} />
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps = createPostList;
