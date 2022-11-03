import { StoryBlokImg } from "@components/storyblok/storyblok-image";
import { IBlogStoryMeta } from "@lib/storyblok-client";
import Link from "next/link";
import React from "react";
import PostHeader from "./post-header";

type Props = {
  post: Readonly<IBlogStoryMeta>;
  hideDescription?: boolean;
  hideImage?: boolean;
};
export default function PostItem({ post, hideDescription, hideImage }: Props) {
  return (
    <div
      key={post.content.title}
      className="flex flex-col overflow-hidden rounded-lg shadow-lg"
    >
      <div className="group relative flex-shrink-0 overflow-hidden">
        <Link href={`/blog/${post.slug}`} className={""}>
          <StoryBlokImg
            img={post.content.primary_image}
            className="h-48 w-full object-cover transition-all duration-150 ease-in-out group-hover:scale-110"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div className="flex-1">
          {/* <p className="text-sm font-medium text-indigo-600">
          <a href={post.category.href} className="hover:underline">
            {post.category.name}
          </a>
        </p> */}
          <Link href={`/blog/${post.slug}`} className="mt-2 block">
            <p className="text-xl font-semibold text-gray-900">
              {post.content.title}
            </p>
            {post.content.description && (
              <p className="mt-3 text-base text-gray-500">
                {post.content.description}
              </p>
            )}
          </Link>
        </div>
        {/* <div className="mt-6 flex items-center">
        <div className="flex-shrink-0">
          <a href={post.author.href}>
            <span className="sr-only">{post.author.name}</span>
            <img
              className="h-10 w-10 rounded-full"
              src={post.author.imageUrl}
              alt=""
            />
          </a>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            <a href={post.author.href} className="hover:underline">
              {post.author.name}
            </a>
          </p>
          <div className="flex space-x-1 text-sm text-gray-500">
            <time dateTime={post.datetime}>{post.date}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readingTime} read</span>
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
}
