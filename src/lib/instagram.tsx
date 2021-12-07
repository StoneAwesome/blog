import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import { MdxRemote } from "next-mdx-remote/types";
import renderToString from "next-mdx-remote/render-to-string";
import { MDX_Components } from "./mdx-helper";
import { listTags, TagContent } from "./tags";
import config from "./config";
import { GetStaticProps } from "next";

const instagramDirectory = path.join(process.cwd(), "content/instagram");

export type InstagramContent = {
  date: string;
  title: string;
  instagram_id: string;
  tags?: string[];
  fullPath: string;
  author?: string;
  sourceSnippet?: MdxRemote.Source;
};

let instagramCache: InstagramContent[];

export function fetchInstagramContent(): InstagramContent[] {
  if (instagramCache) {
    return instagramCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(instagramDirectory);
  const allPostsData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(instagramDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = grabInstagramMatterFromSource(fileContents);
      const matterData = matterResult.data as InstagramContent;
      matterData.fullPath = fullPath;

      const instagram_id = fileName.replace(/\.mdx$/, "");

      // Validate slug string
      if (matterData.instagram_id !== instagram_id) {
        throw new Error(`instagram_id (${instagram_id}) field not match with the path of its content source (${matterData.instagram_id})`);
      }

      return matterData;
    });
  // Sort posts by date
  instagramCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return instagramCache;
}

export function countInstagramPosts(tag?: string): number {
  return fetchInstagramContent().filter((it) => !tag || (it.tags && it.tags.includes(tag))).length;
}

export function listInstagramContent(page: number, limit: number, tag?: string): InstagramContent[] {
  page = !page || page < 1 ? 1 : page;
  return fetchInstagramContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}

export function grabInstagramMatterFromSource(source: string) {
  return matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
  });
}

export async function createMDXSource(content: string, data: { [x: string]: any }) {
  const mdxSource = await renderToString(content, { components: MDX_Components, scope: data });
  return mdxSource;
}

export type PostListProps = {
  posts: InstagramContent[];
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
  const posts = listInstagramContent(page, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: page,
    pages: Math.ceil(countInstagramPosts() / config.posts_per_page),
  };

  return {
    props: {
      posts,
      tags,
      pagination,
    },
  };
};
