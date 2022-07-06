import React from "react";
import Author from "@components/post/post-author";
import DateView from "@components/basic/date-view";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import JsonLdMeta from "@components/meta/json-ld-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import TagButton from "@components/post/tag-button";
import { getAuthor } from "@lib/authors";
import { getTag } from "@lib/tags";
import BasicContainer from "@components/basic/basic-container";

type Props = {
  title: string;
  date: Date;
  slug: string;
  tags?: string[];
  author: string;
  description?: string;
  children: React.ReactNode;
};
export default function PostLayout(props: Props) {
  const { title, date, slug, author, tags, description = "", children } = props;
  const hasTags = tags && tags.length > 0;
  const keywords = hasTags && tags.map ? tags.map((it) => getTag(it).name) : [];
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
    <BasicContainer>
      <article>
        <header className={"my-3"}>
          <h1>{title}</h1>
          <div className={"d-flex align-items-center mb-4 text-muted author-info"}>
            {author && <Author author={getAuthor(author)} />}
            <div className={"d-flex align-items-center ms-3"}>
              <DateView date={date} />
            </div>
          </div>
        </header>
        <div>{children}</div>
        {hasTags && tags.map && (
          <div className={"d-flex flex-wrap border-top py-2"}>
            {tags.map((it, i) => (
              <div key={i} className={"mx-2 my-1"}>
                <TagButton tag={getTag(it)} />
              </div>
            ))}
          </div>
        )}
      </article>
    </BasicContainer>
  );
};
