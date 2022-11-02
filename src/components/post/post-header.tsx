import DateView from "@components/basic/date-view";
import { IBlogStoryMeta } from "@lib/storyblok-client";
import { parse } from "date-fns";
import Link from "next/link";
import * as React from "react";

export type PostHeaderProps = {
  post: Readonly<IBlogStoryMeta>;
};

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const publishDate = parse(post.content.date, "yyyy-MM-dd H:mm", new Date());
  return (
    <header className={"mt-5 mb-3"}>
      <Link href={`/blog/${post.slug}`} className={"text-2xl text-_bsPrimary"}>
        <h1>{post.content.title}</h1>
      </Link>
      <div className={"mb-4 flex items-center gap-4"}>
        {/* <Author author={getAuthor(post.author)} /> */}
        <div className={"flex items-center"}>
          <DateView date={publishDate} />
        </div>
      </div>
    </header>
  );
};

export default PostHeader;
