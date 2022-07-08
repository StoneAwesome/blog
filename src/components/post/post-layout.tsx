import React from "react";
import Author from "@components/post/post-author";
import DateView from "@components/basic/date-view";
import Layout from "@components/main-layout";
import BasicMeta from "@components/meta/basic-meta";
import JsonLdMeta from "@components/meta/json-ld-meta";
import OpenGraphMeta from "@components/meta/open-graph-meta";
import TwitterCardMeta from "@components/meta/twitter-card-meta";
import { getAuthor } from "@lib/authors";
import { getTag } from "@lib/tags";
import BasicContainer from "@components/basic/basic-container";
import TagLink from "./tag-link";
import { Gallery } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

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
      <TwitterCardMeta
        url={`/posts/${slug}`}
        title={title}
        description={description}
      />
      <OpenGraphMeta
        url={`/posts/${slug}`}
        title={title}
        description={description}
      />
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

export const PostBody: React.FC<Props> = ({
  title,
  author,
  date,
  children,
  tags,
}) => {
  const hasTags = tags && tags.length > 0;

  return (
    <BasicContainer>
      <Gallery>
        <article>
          <header className={"my-3"}>
            <h1 className="mb-2 text-4xl">{title}</h1>
            <div className={"author-info mb-4 flex items-center text-gray-500"}>
              {author && <Author author={getAuthor(author)} />}
              <div className={"ml-3 flex items-center"}>
                <DateView date={date} />
              </div>
            </div>
          </header>
          <div className="prose max-w-none [&>p>figure>img]:mb-0">
            {children}
          </div>
          {hasTags && tags.map && (
            <div className={"prose mt-3 flex flex-wrap gap-3 border-t py-2"}>
              {tags.map((it, i) => (
                <TagLink key={i} tag={getTag(it)} />
              ))}
            </div>
          )}
        </article>
      </Gallery>
    </BasicContainer>
  );
};
