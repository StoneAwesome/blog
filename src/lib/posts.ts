import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import { CollectionHelper, ICollectionBase } from "./collection-helper";
import { GetStaticPropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

export interface PostContent extends ICollectionBase {
  author?: string;
  snippet?: string;
  description?: string;
  image?: string;
  /**
   * This is the source snippet
   */
  sourceSnippetString?: string;
}

const postHelper = new CollectionHelper<PostContent>(path.join(process.cwd(), "content/posts"));

export const fetchPostContent = () => postHelper.fetchCollectionContent();

export const countPosts = postHelper.countPosts;

export const listPostContent = postHelper.listContent;

export function grabPostMatterFromSource(source: string) {
  return matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
  });
}
export const createPostList = postHelper.createGetStaticPropsForPage;

export const getStaticPropsForItem = (p: GetStaticPropsContext<ParsedUrlQuery, PreviewData>) =>
  postHelper.getStaticPropsForItem(p);
