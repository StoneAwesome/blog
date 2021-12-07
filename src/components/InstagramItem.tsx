import Date from "./Date";
import Link from "next/link";
import { parseISO } from "date-fns";
import React from "react";
import { InstagramContent } from "../lib/instagram";

type Props = {
  post: Readonly<InstagramContent>;
};
export default function PostItem({ post }: Props) {
  const url = `/instagram/${post.instagram_id}`;
  return (
    <div>
      <header className={"mt-5 mb-3"}>
        <Link href={url}>
          <a className={"text-decoration-none"}>
            <h1>{post.title}</h1>
          </a>
        </Link>
        <div className={"d-flex align-items-center mb-4 text-muted author-info"}>
          
          <div className={"d-flex align-items-center ms-3"}>
            <Date date={parseISO(post.date)} />
          </div>
        </div>
      </header>
      {/* {post. && post.image ? (
        <div>
          <Link href={url}>
            <a>
              <img className={"img-fluid rounded mb-3"} src={post.} alt={post.title} />
            </a>
          </Link>
          <p>{post.description}</p>
        </div>
      ) : null} */}
    </div>
  );
}
