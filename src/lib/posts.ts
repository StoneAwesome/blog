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

const postHelper = new CollectionHelper<PostContent>("content/instagram");

export const fetchPostContent = () => postHelper.fetchCollectionContent();

export const countPosts = (tag?: string) => postHelper.countPosts(tag);

export const listPostContent = (page: number, limit: number, tag?: string) =>
  postHelper.listContent(page, limit, tag);

export const BLOG_POST_PAGE_SIZE = 10;
