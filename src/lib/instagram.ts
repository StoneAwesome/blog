import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import renderToString from "next-mdx-remote/render-to-string";
import { MDX_Components } from "./mdx-helper";
import { CollectionHelper, ICollectionBase } from "./collection-helper";

export interface InstagramContent extends ICollectionBase {
  title: string;
  instagram_id: string;
  fullPath: string;
}

const instagramHelper = new CollectionHelper<InstagramContent>(
  path.join(process.cwd(), "content/instagram")
);

export const fetchInstagramContent = instagramHelper.fetchCollectionContent;

export const countInstagramPosts = instagramHelper.countPosts;

export const listInstagramContent = instagramHelper.fetchCollectionContent;

export const createInstagramList = instagramHelper.createGetStaticPropsForPage;

export function grabInstagramMatterFromSource(source: string) {
  return matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
  });
}

export async function createMDXSource(content: string, data: { [x: string]: any }) {
  const mdxSource = await renderToString(content, { components: MDX_Components, scope: data });
  return mdxSource;
}
