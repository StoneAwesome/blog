import React from "react";
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
import PostHeader from "./post-header";
import { PostContent } from "@lib/posts";
import { parseISO } from "date-fns";

const PostLayout: React.FC<React.PropsWithChildren<{ post: PostContent }>> = ({
  post,
  children,
}) => {
  const { title, date, slug, author, tags, description = "" } = post;
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
        date={parseISO(date)}
        author={authorName}
        description={description}
      />
      <PostBody post={post}>{children}</PostBody>
    </Layout>
  );
};

export default PostLayout;
export const PostBody: React.FC<
  React.PropsWithChildren<{ post: PostContent }>
> = ({ post, children }) => {
  const tags = post.tags;
  const hasTags = tags && tags.length > 0;

  return (
    <BasicContainer>
      <Gallery withCaption withDownloadButton>
        <article>
          <PostHeader post={post} />

          <div className="prose max-w-none [&>p>figure>img]:mb-0">
            {children}
          </div>
          {hasTags && tags.map && (
            <div
              className={
                "prose mt-5 flex max-w-none flex-wrap gap-3 border-t p-3"
              }
            >
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
