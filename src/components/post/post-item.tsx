import type { PostContent } from "@lib/posts";
import DateView from "@components/basic/date-view";
import Link from "next/link";
import { parseISO } from "date-fns";
import React from "react";
import { getAuthor } from "@lib/authors";
import Author from "@components/post/post-author";

type Props = {
  post: Readonly<PostContent>;
};
export default function PostItem({ post }: Props) {
  const url = `/posts/${post.slug}`;
  return (
    <div className="">
      <header className={"mt-5 mb-3"}>
        <Link href={url}>
          <a className={"text-_bsPrimary text-2xl"}>
            <h1>{post.title}</h1>
          </a>
        </Link>
        <div className={"flex items-center mb-4"}>
          <Author author={getAuthor(post.author)} />
          <div className={"flex items-center ml-3"}>
            <DateView date={parseISO(post.date)} />
          </div>
        </div>
      </header>
      {post.description && post.image ? (
        <div className="">
          <Link href={url}>
            <a>
              <img
                className={"w-full max-h-[60vh] object-cover object-center rounded mb-3"}
                src={post.image}
                alt={post.title}
              />
            </a>
          </Link>
          <div className="prose max-w-none">
            <p>{post.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
