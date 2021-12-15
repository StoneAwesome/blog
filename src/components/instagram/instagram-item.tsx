import Link from "next/link";
import React from "react";
import type { InstagramContent } from "@lib/instagram";
import InstagramImage from "./instagram-image";

type Props = {
  post: Readonly<InstagramContent>;
};

export default function InstagramItem({ post }: Props) {
  const url = `/instagram/${post.slug}`;
  const data = post.post;

  return (
    <Link href={url}>
      <a>
        <InstagramImage alt={post.title} instagramId={data.id} image={data.primaryMedia} />
      </a>
    </Link>
  );
}
