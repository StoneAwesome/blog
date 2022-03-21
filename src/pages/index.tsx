import React from "react";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import { InferGetStaticPropsType } from "next";
import InstagramList from "@components/instagram/instagram-list";
import { createInstagramList } from "@lib/instagram";

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
      <InstagramList posts={posts} tags={tags} pagination={pagination} />
    </Layout>
  );
}
export const getStaticProps = createInstagramList;
