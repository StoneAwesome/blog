import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import renderToString from "next-mdx-remote/render-to-string";
import { MDX_Components } from "./mdx-helper";
import { listTags, TagContent } from "./tags";
import config from "./config";
import { GetStaticPaths, GetStaticProps } from "next";
import type { MdxRemote } from "next-mdx-remote/types";

export interface ICollectionBase {
  date: string;
  title: string;
  fullPath: string;
  slug: string;
  tags?: string[];
}

type ICollectionSource<T extends ICollectionBase = ICollectionBase> = T & {
  source: MdxRemote.Source;
}


export type CollectionListProps<T extends ICollectionBase> = {
  posts: T[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};

export class CollectionHelper<T extends ICollectionBase> {
  private cache: T[];
  private cacheDictionary: { [slug: string]: T };

  constructor(private directory: string) {}

  fetchCollectionContent(): T[] {
    //-- Todo how we remove the need for the this because of the lexicographical scoping.
    if (this.cache) {
      return this.cache;
    }
    // Get file names under /posts
    const fileNames = fs.readdirSync(this.directory);
    const allPostsData = fileNames
      .filter((it) => it.endsWith(".mdx"))
      .map((fileName) => {
        // Read markdown file as string
        const fullPath = path.join(this.directory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Use gray-matter to parse the post metadata section
        const matterResult = grabMatterFromSource(fileContents);
        const matterData = matterResult.data as T;
        matterData.fullPath = fullPath;

        const slug = fileName.replace(/\.mdx$/, "");

        // Validate slug string
        if (matterData.slug !== slug) {
          throw new Error("slug field not match with the path of its content source");
        }

        return matterData;
      });

    // Sort posts by date
    this.cache = allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
    this.cacheDictionary = {};
    this.cache.forEach((i) => (this.cacheDictionary[i.slug] = i));
    return this.cache;
  }

  listContent(page: number, limit: number, tag?: string) {
    page = !page || page < 1 ? 1 : page;
    return this.fetchCollectionContent()
      .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
      .slice((page - 1) * limit, page * limit);
  }

  countPosts(tag?: string): number {
    return this.fetchCollectionContent().filter((it) => !tag || (it.tags && it.tags.includes(tag)))
      .length;
  }

  createGetStaticPropsForPage: GetStaticProps<CollectionListProps<T>, { page: string }> = async ({
    params,
  }) => {
    const page = parseInt((params?.page as string) || "1");
    const posts = this.listContent(page, config.posts_per_page);
    const tags = listTags();
    const pagination = {
      current: page,
      pages: Math.ceil(this.countPosts() / config.posts_per_page),
    };

    return {
      props: {
        posts,
        tags,
        pagination,
      },
    };
  };

  getStaticPaths: GetStaticPaths = async () => {
    const paths = this.fetchCollectionContent().map((it) => "/posts/" + it.slug);
    return {
      paths,
      fallback: false,
    };
  };

  getStaticPropsForItem: GetStaticProps<ICollectionSource<T>> = async ({ params }) => {
    this.fetchCollectionContent();
    const slug = params.slug as string;
    const fullPath = this.cacheDictionary[slug]?.fullPath;

    if (!fullPath) {
      return {
        notFound: true,
      };
    }
    const source = fs.readFileSync(fullPath, "utf8");
    const { content, data } = grabMatterFromSource<T>(source);
    const mdxSource = await createMDXSource(content, data);
    
    return {
      props: {
        ...data,
        source: mdxSource
      },
    };
  };
}


async function createMDXSource(content: string, data: { [x: string]: any }) {
  const mdxSource = await renderToString(content, { components: MDX_Components, scope: data });
  return mdxSource;
}

function grabMatterFromSource<T>(source: string) {
  const result = matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
  });
  
  return ({
    content: result.content,
    data: result.data as T
  });
}
