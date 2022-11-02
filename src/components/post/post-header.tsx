import DateView from "@components/basic/date-view";
import { PostContent } from "@lib/posts";
import { parseISO } from "date-fns";
import Link from "next/link";
import * as React from "react";
import { getPostUrl } from "./post-link";

export type PostHeaderProps = {
  post: Readonly<PostContent>;
};

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  return (
    <GenericPostHeader
      url={getPostUrl(post)}
      title={post.title}
      date={parseISO(post.date)}
    />
  );
};

export const GenericPostHeader: React.FC<{
  url: string;
  title: string;
  date: Date;
}> = (props) => {
  return (
    <header className={"mt-5 mb-3"}>
      <Link href={props.url} className={"text-2xl text-_bsPrimary"}>
        <h1>{props.title}</h1>
      </Link>
      <div className={"mb-4 flex items-center gap-4"}>
        {/* <Author author={getAuthor(post.author)} /> */}
        <div className={"flex items-center"}>
          <DateView date={props.date} />
        </div>
      </div>
    </header>
  );
};

export default PostHeader;
