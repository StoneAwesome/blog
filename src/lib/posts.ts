import path from "path";
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

export const countPosts = (tag?: string) => postHelper.countPosts(tag);

export const listPostContent = (page: number, limit: number, tag?: string) =>
  postHelper.listContent(page, limit, tag);


export const createPostList = (ctx) => postHelper.createGetStaticPropsForPage(ctx);

export const createPostListPaths = postHelper.getStaticPathsForPages;

export const getStaticPathsForPosts = postHelper.getStaticPathsForItems("posts");

export const getStaticPropsForItem = (p: GetStaticPropsContext<ParsedUrlQuery, PreviewData>) =>
  postHelper.getStaticPropsForItem(p);
