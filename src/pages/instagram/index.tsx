import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import InstagramList from "@components/instagram/instagram-list";
import { createInstagramList, InstagramContent } from "@lib/instagram";
import { TagContent } from "@lib/tags";

type InstagramListProps = {
  posts: InstagramContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function InstagramListPage({ posts, tags, pagination }: InstagramListProps) {
  const url = "/instagram";
  const title = "Instagram Feed";
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
