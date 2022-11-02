import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { grabStroyBlokBlogLinks } from "@lib/storyblok-service";
import Link from "next/link";

export type BlogIndexPageProps = {
  links: Awaited<ReturnType<typeof grabStroyBlokBlogLinks>>;
};

const BlogIndexPage: React.FC<BlogIndexPageProps> = (props) => {
  return (
    <div>
      <h1>Hello BlogIndexPage</h1>
      {props.links.map((l) => (
        <Link key={l.slug} href={l.slug}>
          {l.name}
        </Link>
      ))}
      <pre>
        <code>{JSON.stringify(props.links, null, 2)}</code>
      </pre>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  BlogIndexPageProps
> = async (ctx) => {
  const links = await grabStroyBlokBlogLinks(true);
  return {
    props: {
      links: links,
    },
  };
};

export default BlogIndexPage;
