import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import { MDX_Components } from "./mdx-helper";
import { listTags, TagContent } from "./tags";
import config from "./config";
import { GetStaticPaths, GetStaticProps } from "next";
import type { MdxRemote } from "next-mdx-remote/types";
import type renderToString from "next-mdx-remote/render-to-string";
import { setToArray, toDictionary } from "./array-utils";

export type RTS = typeof renderToString;

export interface ICollectionBase {
  date: string;
  title: string;
  fullPath: string;
  slug: string;
  tags?: string[];
}

export type ICollectionSource<T extends ICollectionBase = ICollectionBase> =
  T & {
    source: MdxRemote.Source;
  };

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
  private cacheDictionary: NodeJS.Dict<T>;
  private hasRanInitializationOverride?: boolean;

  private directory: string;

  constructor(
    /** Sub Directory. No need for leading slash */
    subDirectory: string,
    private pageSize: number = 42,
    private overrideInitialization?: (
      mdxItems: T[],
      fnGenerator: (slug: string) => string
    ) => Promise<T[]>
  ) {
    this.directory = path.join(process.cwd(), subDirectory);
    const result = this.initializeCache();

    this.cache = result.cache;
    this.cacheDictionary = result.dictionary;
    this.hasRanInitializationOverride = overrideInitialization ? false : true;
  }

  private createFullPathFromSlug(slug: string) {
    return `${path.join(this.directory, slug)}.mdx`;
  }

  private initializeCache() {
    if (this.cache && this.cacheDictionary) {
      return { cache: this.cache, dictionary: this.cacheDictionary };
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
        // if (matterData.slug !== slug) {
        //   throw new Error(
        //     `slug ${slug} field not match with the path of its content source ${matterData.slug}`
        //   );
        // }

        return matterData;
      });

    // Sort posts by date
    const cache = allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
    return {
      cache,
      dictionary: toDictionary(cache, (c) => c.slug),
    };
  }

  async fetchCollectionContent(): Promise<T[]> {
    if (!this.hasRanInitializationOverride && this.overrideInitialization) {
      this.cache = await this.overrideInitialization(this.cache, (v) =>
        this.createFullPathFromSlug(v)
      );
      this.cacheDictionary = toDictionary(this.cache, (c) => c.slug);
    }
    return this.cache;
  }

  async listContent(page: number, limit: number, tag?: string) {
    page = !page || page < 1 ? 1 : page;
    const content = await this.fetchCollectionContent();
    return content
      .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
      .slice((page - 1) * limit, page * limit);
  }

  async countPosts(tag?: string): Promise<number> {
    const posts = await this.fetchCollectionContent();
    return posts.filter((it) => !tag || (it.tags && it.tags.includes(tag)))
      .length;
  }

  createGetStaticPropsForPage: GetStaticProps<
    CollectionListProps<T>,
    { page: string }
  > = async ({ params }) => {
    const page = parseInt((params?.page as string) || "1");
    const posts = await this.listContent(page, this.pageSize);
    const tags = listTags();
    const total = await this.countPosts();
    const pagination = {
      current: page,
      pages: Math.ceil(total / this.pageSize),
    };

    return {
      props: {
        posts,
        tags,
        pagination,
      },
    };
  };

  getStaticPathsForItems(
    path: string,
    getAdditionalRoutes?: () => Promise<string[]>
  ) {
    const result: GetStaticPaths = async () => {
      const content = await this.fetchCollectionContent();
      let paths = content.map((it) => `/${path}/${it.slug}`);

      if (getAdditionalRoutes) {
        const allPaths = new Set([...paths]);
        const additionalPaths = await getAdditionalRoutes();
        additionalPaths.forEach((p) => allPaths.add(p));
        paths = setToArray(allPaths);
      }

      return {
        paths,
        fallback: false,
      };
    };
    return result;
  }

  getStaticPathsForPages() {
    const result: GetStaticPaths = async () => {
      const totalPages = await this.countPosts();

      const pages = Math.ceil(totalPages / this.pageSize);
      const paths = Array.from(Array(pages - 1).keys()).map((it) => ({
        params: { page: (it + 2).toString() },
      }));
      return {
        paths: paths,
        fallback: false,
      };
    };
    return result;
  }

  getStaticPropsForItem(rts: RTS): GetStaticProps<ICollectionSource<T>> {
    return this.getEnhancedStaticPropsForItem(rts, async (x) => x);
  }

  getEnhancedStaticPropsForItem<TEnhanced extends T>(
    rts: RTS,
    enhancer: (item: T) => Promise<TEnhanced>
  ) {
    const func: GetStaticProps<ICollectionSource<TEnhanced>> = async ({
      params,
    }) => {
      this.fetchCollectionContent();
      const slug = params?.slug as string;
      const fullPath = this.cacheDictionary[slug]?.fullPath;

      if (!fullPath || !fs.existsSync(fullPath)) {
        return {
          notFound: true,
        };
      }

      const source = fs.readFileSync(fullPath, "utf8");
      const { content, data } = grabMatterFromSource<T>(source);
      const mdxSource = await createMDXSource(content, data, rts);

      const enhancedData = await enhancer(data);

      return {
        props: {
          ...enhancedData,
          source: mdxSource,
        },
      };
    };

    return func;
  }
}

async function createMDXSource(
  content: string,
  data: { [x: string]: any },
  rts: RTS
) {
  const mdxSource = await rts(content, {
    components: MDX_Components,
    scope: data,
  });
  return mdxSource;
}

function grabMatterFromSource<T>(source: string) {
  const result = matter(source, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
    },
  });

  return {
    content: result.content,
    data: result.data as T,
  };
}
