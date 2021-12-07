import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import renderToString from "next-mdx-remote/render-to-string";
import { MDX_Components } from "./mdx-helper";
import { listTags, TagContent } from "./tags";
import config from "./config";
import { GetStaticProps } from "next";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostContent = {
  date: string;
  title: string;
  slug: string;
  tags?: string[];
  fullPath: string;
  author?: string;
  snippet?: string;
  description?: string;
  image?: string;
  /**
   * This is the source snippet
   */
  sourceSnippetString?: string;
};

let postCache: PostContent[];

export function fetchPostContent(): PostContent[] {
  if (postCache) {
    return postCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = grabPostMatterFromSource(fileContents);
      const matterData = matterResult.data as PostContent;
      matterData.fullPath = fullPath;
      matterData.sourceSnippetString = getSnippetContent(matterResult.content);

      const slug = fileName.replace(/\.mdx$/, "");

      // Validate slug string
      if (matterData.slug !== slug) {
        throw new Error("slug field not match with the path of its content source");
      }

      return matterData;
    });
  // Sort posts by date
  postCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return postCache;
}

export function countPosts(tag?: string): number {
  return fetchPostContent().filter((it) => !tag || (it.tags && it.tags.includes(tag))).length;
}

export function listPostContent(page: number, limit: number, tag?: string): PostContent[] {
  page = !page || page < 1 ? 1 : page;
  return fetchPostContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}

export function grabPostMatterFromSource(source: string) {
  return matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
  });
}

export async function createMDXSource(content: string, data: { [x: string]: any }) {
  const mdxSource = await renderToString(content, { components: MDX_Components, scope: data });
  return mdxSource;
}

function getSnippetContent(body: string) {
  body = body.replace(/<blockquote>/g, '<blockquote class="blockquote">');

  if (body.match("<!--more-->")) {
    const bdy = body.split("<!--more-->");
    if (typeof bdy[0] !== "undefined") {
      return bdy[0];
    }
  }
  return null;
}

export type PostListProps = {
  posts: PostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export const createPostList: GetStaticProps<PostListProps, { page: string }> = async ({
  params,
}) => {
  const page = parseInt((params?.page as string) || "1");
  const posts = listPostContent(page, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: page,
    pages: Math.ceil(countPosts() / config.posts_per_page),
  };

  return {
    props: {
      posts,
      tags,
      pagination,
    },
  };
};
