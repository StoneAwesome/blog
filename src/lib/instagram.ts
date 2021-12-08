import { GetStaticPropsContext, PreviewData } from "next";
import path from "path";
import { CollectionHelper, ICollectionBase, RTS } from "./collection-helper";
import InstagramAPI from "./instagram-service";

export interface InstagramContent extends ICollectionBase {
  title: string;
  fullPath: string;
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

export const getInstagramItemProps = (rts: RTS) =>
  instagramHelper.getEnhancedStaticPropsForItem(rts, async (i) => {
    const instagramService = new InstagramAPI();
    const post = await instagramService.getPost(i.slug);
    return {
      ...i,
      post,
    };
  });
