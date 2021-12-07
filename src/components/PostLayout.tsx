import React from "react";
import Author from "./Author";
import Copyright from "./Copyright";
import Date from "./Date";
import Layout from "./Layout";
import BasicMeta from "./meta/BasicMeta";
import JsonLdMeta from "./meta/JsonLdMeta";
import OpenGraphMeta from "./meta/OpenGraphMeta";
import TwitterCardMeta from "./meta/TwitterCardMeta";
import TagButton from "./TagButton";
import { getAuthor } from "../lib/authors";
import { getTag } from "../lib/tags";

type Props = {
  title: string;
  date: Date;
  slug: string;
  tags: string[];
  author: string;
  description?: string;
  children: React.ReactNode;
};
export default function PostLayout(props: Props) {
  const { title, date, slug, author, tags, description = "", children } = props;
  const hasTags = tags && tags.length > 0;
  const keywords = hasTags ? tags.map((it) => getTag(it).name) : [];
  const authorName = getAuthor(author).name;
  return (
    <Layout>
      <BasicMeta
        url={`/posts/${slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta url={`/posts/${slug}`} title={title} description={description} />
      <OpenGraphMeta url={`/posts/${slug}`} title={title} description={description} />
      <JsonLdMeta
        url={`/posts/${slug}`}
        title={title}
        keywords={keywords}
        date={date}
        author={authorName}
        description={description}
      />
      <PostBody {...props} />
    </Layout>
  );
}

export const PostBody: React.FC<Props> = ({ title, author, date, children, tags }) => {
  const hasTags = tags && tags.length > 0;

  return (
    <div className={"container"}>
      <div className={"posts-container"}>
        <article>
          <header className={"mb-3"}>
            <h1>{title}</h1>
            <div className={"d-flex align-items-center mb-4 text-muted author-info"}>
              <Author author={getAuthor(author)} />
              <div className={"d-flex align-items-center ms-3"}>
                <Date date={date} />
              </div>
            </div>
          </header>
          <div>{children}</div>
          {hasTags && (
            <div className={"d-flex flex-wrap border-top py-2"}>
              {tags.map((it, i) => (
                <div key={i} className={"mx-2 my-1"}>
                  <TagButton tag={getTag(it)} />
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <footer>
        <Copyright />
      </footer>
    </div>
  );
};
