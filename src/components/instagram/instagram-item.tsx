import DateView from "../basic/date-view";
import Link from "next/link";
import { parseISO } from "date-fns";
import React from "react";
import type { InstagramContent } from "@lib/instagram";
import { useIsLessThenMD } from "@hooks/use-media";
import InstagramMaterialLink from "./instagram-material-link";
import InstagramImage from "./instagram-image";

type Props = {
  post: Readonly<InstagramContent>;
};

export default function PostItem({ post }: Props) {
  const url = `/instagram/${post.slug}`;
  const size = useIsLessThenMD();
  const data = post.post;

  return (
    <div className={"d-flex flex-column text-center"}>
      <header>
        <Link href={url}>
          <a className={"text-decoration-none"}>
            <h1>{post.title}</h1>
          </a>
        </Link>
      </header>
      <small className={"d-flex align-items-center flex-column"}>
        <DateView date={parseISO(post.date)} />
      </small>
      {data ? (
        <div className={`mt-3 text-center w-${size ? "75" : "50"} align-self-center`}>
          <Link href={url}>
            <a>
              <InstagramImage
                className={`img-fluid rounded`}
                alt={post.title}
                instagramId={data.id}
                image={data.primaryMedia}
              />
            </a>
          </Link>
        </div>
      ) : null}

      {post.material && (
        <div className={"d-flex flex-wrap align-self-center mt-3 gap-3"}>
          {post.material.map((m) => (
            <InstagramMaterialLink material={m} key={m} />
          ))}
        </div>
      )}
    </div>
  );
}
