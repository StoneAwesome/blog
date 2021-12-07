import Layout from "../../components/Layout";
import BasicMeta from "../../components/meta/BasicMeta";
import OpenGraphMeta from "../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../components/meta/TwitterCardMeta";
import InstagramList from "../../components/InstagramList";
import { createInstagramList, InstagramContent } from "../../lib/instagram";
import { TagContent } from "../../lib/tags";

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
