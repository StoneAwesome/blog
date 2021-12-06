import type { PostContent } from "../lib/posts";
import Date from "./Date";
import Link from "next/link";
import { parseISO } from "date-fns";
import React from "react";
import { getAuthor } from "../lib/authors";
import Author from "./Author";
import { hydrateSource } from "../lib/mdx-helper";

type Props = {
  post: Readonly<PostContent>;
};
export default function PostItem({ post }: Props) {
  const details = post.sourceSnippet ? hydrateSource(post.sourceSnippet) : null;
  const url = `/posts/${post.slug}`;
  return (
    <div>
      <header className={"mt-5 mb-3"}>
        <Link href={url}>
          <a className={"text-decoration-none"}>
            <h1 className={"post-title fw-500"}>{post.title}</h1>
          </a>
        </Link>
        <div className={"d-flex align-items-center mb-4 text-muted author-info"}>
          <Author author={getAuthor(post.author)} />
          <div className={"d-flex align-items-center ms-3"}>
            <Date date={parseISO(post.date)} />
          </div>
        </div>
      </header>
      {post.description && post.image ? (
        <div>
          <Link href={url}>
            <a>
              <img className={"img-fluid rounded mb-3"} src={post.image} alt={post.title} />
            </a>
          </Link>
          <p>{post.description}</p>
        </div>
      ) : null}
    </div>
  );
}
