import DateView from "@components/basic/date-view";
import ShareButton from "@components/basic/share-button";
import { IBlogStoryMeta } from "@lib/storyblok/storyblok-blog-client";
import type { IStoryBlockStory } from "@lib/storyblok/storyblok-client-base";
import { parse } from "date-fns";
import Link from "next/link";
import * as React from "react";

export type PostHeaderProps = {
  post: Readonly<IStoryBlockStory<IBlogStoryMeta>>;
};

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const publishDate = parse(post.content.date, "yyyy-MM-dd H:mm", new Date());
  const url = `/blog/${post.slug}`;
  return (
    <header className={"mt-5 mb-3 grid grid-flow-row"}>
      <Link
        href={url}
        className={"col-span-2 text-2xl text-_bsPrimary md:col-span-1"}
      >
        <h1>{post.content.title}</h1>
      </Link>
      <div className="mt-1 whitespace-nowrap">
        <DateView date={publishDate} />
      </div>
      <ShareButton
        title={`${post.content.title} - StoneAwesome`}
        className={
          "my-auto ml-auto px-2 text-lg font-normal md:col-start-2 md:row-span-2 md:row-start-1"
        }
      />
    </header>
  );
};

export default PostHeader;
