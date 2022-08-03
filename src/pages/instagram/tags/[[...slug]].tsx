import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import config from "@lib/config";
import {
  countInstagram,
  InstagramContent,
  listInstagramContent,
} from "@lib/instagram";
import { getTag, listTags, TagContent, listTagsByType } from "@lib/tags";
import InstagramTagList from "@components/instagram/instagram-tag-list";
import InstagramTagLink from "@components/instagram/instagram-tag-link";
import BasicContainer from "@components/basic/basic-container";

type Props = {
  posts: InstagramContent[];
  tag: TagContent | null;
  page?: string;
  allTags: ReturnType<typeof listTagsByType>;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({
  posts,
  tag,
  pagination,
  page,
  allTags,
}: Props) {
  const hasPosts = tag && posts.length > 0;
  const url = hasPosts
    ? `/instagram/tags/${tag.name}` + (page ? `/${page}` : "")
    : "/instagram/tags";
  const title = hasPosts
    ? `Stone inspiration that contains ${tag.name} stones`
    : "Stone inspiration by material, color or feature!";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      {hasPosts ? (
        <InstagramTagList posts={posts} tag={tag} pagination={pagination} />
      ) : (
        <BasicContainer>
          <div className="mt-3 flex flex-col gap-3">
            <TagList tags={allTags.colors} type={"Colors"} />
            <TagList tags={allTags.materials} type={"Materials"} />
            <TagList tags={allTags.tags} type={"Features"} />
          </div>
        </BasicContainer>
      )}
    </Layout>
  );
}
const TagList: React.FC<{ tags: TagContent[]; type: string }> = (props) => {
  if (props.tags?.length === 0) return null;

  return (
    <div>
      <h2 className="border-b text-3xl">{props.type}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {props.tags.map((t) => (
          <InstagramTagLink
            className="blog-link my-1 text-xl"
            tag={{
              tag: t.slug,
              type: props.type as any,
            }}
            key={t.name}
          />
        ))}
      </div>
    </div>
  );
};
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const queries = params?.slug as string[];
  const [slug, page] = [queries?.[0], queries?.[1]];
  const posts = slug
    ? await listInstagramContent(
        page ? parseInt(page as string) : 1,
        config.posts_per_page,
        slug
      )
    : [];
  const tag = slug ? getTag(slug) : null;
  const pagination = {
    current: page ? parseInt(page as string) : 1,
    pages: Math.ceil((await countInstagram(slug)) / config.posts_per_page),
  };
  const props: Props = { posts, tag, pagination, allTags: listTagsByType() };
  if (page) {
    props.page = page;
  }
  return {
    props,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = listTags();

  const pathsForTag = await Promise.all(
    allTags.map(async (tag) => {
      const pages = Math.ceil(
        (await countInstagram(tag.slug)) / config.posts_per_page
      );
      return Array.from(Array(pages).keys()).map((page) =>
        page === 0
          ? {
              params: { slug: [tag.slug] },
            }
          : {
              params: { slug: [tag.slug, (page + 1).toString()] },
            }
      );
    })
  );

  const paths = pathsForTag.flatMap((i) => i);

  return {
    paths: [
      ...paths,
      {
        params: {
          slug: [],
        },
      },
    ],
    fallback: false,
  };
};
