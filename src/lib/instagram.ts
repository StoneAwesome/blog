import { GetStaticPropsContext, PreviewData } from "next";
import path from "path";
import { CollectionHelper, ICollectionBase, RTS } from "./collection-helper";
import InstagramAPI, { InstagramMedia } from "./instagram-service";

const api = new InstagramAPI();

export interface StoredInstagramImage {
  url: string;
  id: string;
  width: number;
  height: number;
}

export interface InstagramPost {
  caption: string;
  id: string;
  mediaType: InstagramMedia["media_type"];
  permalink: string;
  timestamp: string;
  images: StoredInstagramImage[];
}

export interface InstagramContent extends ICollectionBase {
  material?: string[];
  post: InstagramPost;
}

const instagramHelper = new CollectionHelper<InstagramContent>(
  path.join(process.cwd(), "content/instagram")
);

export const fetchInstagramContent = () => instagramHelper.fetchCollectionContent();

export const createInstagramList = (ctx: GetStaticPropsContext<{ page: string }, PreviewData>) =>
  instagramHelper.createGetStaticPropsForPage(ctx);

export const createInstagramItemPaths = (path: string) =>
  instagramHelper.getStaticPathsForItems(path);

export const createInstagramPathsForPages = () => instagramHelper.getStaticPathsForPages();
export const getInstagramItemProps = (rts: RTS) => instagramHelper.getStaticPropsForItem(rts);
