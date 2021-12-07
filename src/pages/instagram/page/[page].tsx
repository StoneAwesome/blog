import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import BasicMeta from "../../../components/meta/BasicMeta";
import OpenGraphMeta from "../../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../../components/meta/TwitterCardMeta";
import InstagramList from "../../../components/InstagramList";
import config from "../../../lib/config";
import { countInstagramPosts, createInstagramList, InstagramContent } from "../../../lib/instagram";
import { TagContent } from "../../../lib/tags";

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

export const getStaticProps: GetStaticProps = createInstagramList;

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = Math.ceil(countInstagramPosts() / config.posts_per_page);
  const paths = Array.from(Array(pages - 1).keys()).map((it) => ({
    params: { page: (it + 2).toString() },
  }));
  return {
    paths: paths,
    fallback: false,
  };
};
