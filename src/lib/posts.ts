import { GetStaticPropsContext, PreviewData } from "next";
import { CollectionHelper, ICollectionBase, RTS } from "./collection-helper";

export interface PostContent extends ICollectionBase {
  author: string;
  snippet?: string;
  description?: string;
  image?: string;
  /**
   * This is the source snippet
   */
  sourceSnippetString?: string;
}

const postHelper = new CollectionHelper<PostContent>("content/posts");

export const fetchPostContent = () => postHelper.fetchCollectionContent();

export const countPosts = (tag?: string) => postHelper.countPosts(tag);

export const listPostContent = (page: number, limit: number, tag?: string) =>
  postHelper.listContent(page, limit, tag);

export const createPostList = (
  ctx: GetStaticPropsContext<{ page: string }, PreviewData>
) => postHelper.createGetStaticPropsForPage(ctx);

export const createPostListPaths = () => postHelper.getStaticPathsForPages();
export const createPostItemPaths = () =>
  postHelper.getStaticPathsForItems("posts");
export const getStaticPropsForItem = (rts: RTS) =>
  postHelper.getStaticPropsForItem(rts);
