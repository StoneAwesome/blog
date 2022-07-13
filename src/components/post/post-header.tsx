import DateView from "@components/basic/date-view";
import { getAuthor } from "@lib/authors";
import { PostContent } from "@lib/posts";
import { parseISO } from "date-fns";
import * as React from "react";
import Author from "./post-author";
import PostLink from "./post-link";

export type PostHeaderProps = {
  post: Readonly<PostContent>;
};

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  return (
    <header className={"mt-5 mb-3"}>
      <PostLink post={post}>
        <a className={"text-2xl text-_bsPrimary"}>
          <h1>{post.title}</h1>
        </a>
      </PostLink>
      <div className={"mb-4 flex items-center"}>
        <Author author={getAuthor(post.author)} />
        <div className={"ml-3 flex items-center"}>
          <DateView date={parseISO(post.date)} />
        </div>
      </div>
    </header>
  );
};

export default PostHeader;
