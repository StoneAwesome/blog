import { GetStaticPropsContext, PreviewData } from "next";
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
  links?: {
    title: string;
    isSt?: boolean;
    url: string;
  }[];
  images: StoredInstagramImage[];
  primaryMedia: StoredInstagramImage;
}

export interface InstagramContent extends ICollectionBase {
  material?: string[];
  colors?: string[];
  post: InstagramPost;
}

const instagramHelper = new CollectionHelper<InstagramContent>(
  "content/instagram",
  24
);

function tagFilter(
  tag: string | undefined
): ((x: InstagramContent) => boolean) | undefined {
  return (x) =>
    !!x.material?.some((m) => m.toLowerCase() === tag) ||
    !!x.colors?.some((c) => c.toLowerCase() === tag);
}

export const countInstagram = (tag?: string) =>
  instagramHelper.countPosts(tag, tagFilter(tag));

export const listInstagramContent = (
  page: number,
  limit: number,
  tag?: string
) => instagramHelper.listContent(page, limit, tag, tagFilter(tag));

export const fetchInstagramContent = () =>
  instagramHelper.fetchCollectionContent();

export const createInstagramList = (
  ctx: GetStaticPropsContext<{ page: string }, PreviewData>
) => instagramHelper.createGetStaticPropsForPage(ctx);

export const createInstagramItemPaths = () =>
  instagramHelper.getStaticPathsForItems("instagram");

export const createInstagramPathsForPages = () =>
  instagramHelper.getStaticPathsForPages();
export const getInstagramItemProps = (rts: RTS) =>
  instagramHelper.getStaticPropsForItem(rts);
