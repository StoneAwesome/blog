import * as React from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import BasicContainer from "@components/basic/basic-container";
import Pagination from "@components/basic/pagination";
import StoryBlokClient from "@lib/storyblok-client";

export type BlogIndexPageProps = {
  links: Awaited<ReturnType<typeof StoryBlokClient.grabStroyBlokBlogLinks>>;
};

const BlogIndexPage: React.FC<BlogIndexPageProps> = (props) => {
  const url = "/blog";
  const title = "StoneAwesome Blog";
  const pagination = {
    current: 0,
    pages: 1,
  };
  return (
    <Layout>
      <BasicMeta url={"/blog"} title={"StoneAwesome Blog"} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <BasicContainer>
        <div className={"my-5"}>
          <div className={"mb-5"}>
            {props.links.map((l) => (
              <Link key={l.slug} href={l.slug}>
                {l.name}
              </Link>
            ))}

            {/* {posts.map((it, i) => (
              <div key={i}>
                <PostItem post={it} />
              </div>
            ))} */}
          </div>
          {pagination.pages > 0 && (
            <Pagination
              current={pagination.current}
              pages={pagination.pages}
              link={{
                href: (page) => (page === 1 ? "/blog" : "/blog/page/[page]"),
                as: (page) => (page === 1 ? "" : "/blog/page/" + page),
              }}
            />
          )}
        </div>
      </BasicContainer>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<
  BlogIndexPageProps
> = async (ctx) => {
  const links = await StoryBlokClient.grabStroyBlokBlogLinks(true);

  return {
    props: {
      links: links,
    },
  };
};

export default BlogIndexPage;
