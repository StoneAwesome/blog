import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import PostList from "@components/post/post-list";
import { createPostList, PostContent } from "@lib/posts";
import { TagContent } from "@lib/tags";

type Props = {
  posts: PostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ posts, tags, pagination }: Props) {
  const url = "/posts";
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

export const getStaticProps = createPostList;
