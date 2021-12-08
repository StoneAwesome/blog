import React from "react";
import { PostContent } from "@lib/posts";
import { TagContent } from "@lib/tags";
import PostItem from "./post-item";
import Pagination from "../basic/pagination";
import Link from "next/link";

type Props = {
  posts: PostContent[];
  tag: TagContent;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function TagPostList({ posts, tag, pagination }: Props) {
  return (
    <div className={"container"}>
      <div className={"posts-container"}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href={"/posts"}>
                <a>{"All Posts"}</a>
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {tag.name}
            </li>
          </ol>
        </nav>
        <h1>
          All posts / <span>{tag.name}</span>
        </h1>
        <div>
          {posts.map((it, i) => (
            <div key={i}>
              <PostItem post={it} />
            </div>
          ))}
        </div>
        <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: () => "/posts/tags/[[...slug]]",
            as: (page) =>
              page === 1 ? "/posts/tags/" + tag.slug : `/posts/tags/${tag.slug}/${page}`,
          }}
        />
      </div>
    </div>
  );
}
