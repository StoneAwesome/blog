import React from "react";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import InstagramList from "@components/instagram/instagram-list";
import { createInstagramList } from "@lib/instagram";
import StoryBlokClient from "@lib/storyblok/storyblok-blog-client";
import StoryBlokMaterialClient from "@lib/storyblok/storyblok-material-client";

export default function MaterialPage(
  props: //   posts,
  //   tags,
  //   pagination,
  InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <Layout>
      <BasicMeta url={"/"} />
      <OpenGraphMeta url={"/"} />
      <TwitterCardMeta url={"/"} />
      <div className="prose">
        <pre>
          <code>{JSON.stringify(props, null, 2)}</code>
        </pre>
      </div>
    </Layout>
  );
}

//-- For now we'll just need to hard code these as it's easier.

// const MAIN_MATERIAL_PAGES = [
//   {
//     name: "Granite",
//     id: 142466688,
//     uuid: "9cdd4373-91cc-4f16-9163-c1def44789c7",
//   },
// ];

export const getStaticProps: GetStaticProps<{}> = async (ctx) => {
  const material = await StoryBlokMaterialClient.grabMaterialStories();
  return {
    props: {
      materials: material,
    },
  };
};
