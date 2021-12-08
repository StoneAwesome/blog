import Layout from "../../../components/Layout";
import BasicMeta from "../../../components/meta/BasicMeta";
import OpenGraphMeta from "../../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../../components/meta/TwitterCardMeta";
import InstagramList from "../../../components/InstagramList";
import { createInstagramList, createInstagramPathsForPages } from "../../../lib/instagram";
import type { InstagramContent } from "../../../lib/instagram";
import { TagContent } from "../../../lib/tags";
import { GetStaticPaths } from "next";

type Props = {
  posts: Readonly<InstagramContent>[];
  tags: TagContent[];
  page: number;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Page({ posts, tags, pagination, page }: Props) {
  const url = `/instagram/page/${page}`;
  const title = "Instagram";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <InstagramList posts={posts} tags={tags} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps = createInstagramList;

export const getStaticPaths = createInstagramPathsForPages();
