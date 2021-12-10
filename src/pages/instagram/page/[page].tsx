import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import InstagramList from "@components/instagram/instagram-list";
import { createInstagramList, createInstagramPathsForPages } from "@lib/instagram";
import type { InstagramContent } from "@lib/instagram";
import { TagContent } from "@lib/tags";

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
