import path from "path";
import { CollectionHelper, ICollectionBase, RTS } from "./collection-helper";

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

export const countPosts = (tag?: string) => 2;// postHelper.countPosts(tag);

export const listPostContent = (page: number, limit: number, tag?: string) =>
  postHelper.listContent(page, limit, tag);

export const createPostList = (ctx) => postHelper.createGetStaticPropsForPage(ctx);

export const createPostListPaths = () => postHelper.getStaticPathsForPages();

export const getStaticPathsForPosts = postHelper.getStaticPathsForItems("posts");

export const getStaticPropsForItem = (rts: RTS) => postHelper.getStaticPropsForItem(rts);
