import StoryBlokClientBaseClass, {
  IStoriesCollectionInterface,
  IStoriesResponse,
  IStoryBlokAssetMeta,
  IStoryBlokContent,
} from "./storyblok-client-base";

export interface IDesigner extends IStoryBlokContent {
  name: string;
  instagram_id?: string;
  facebook_id?: string;
  website?: {
    id: string;
    url: string;
    linktype: string;
    fieldtype: string;
    cached_url: string;
  };
}
export type IBlogStory = IStoryBlokContent & {
  title: string;
  /**
   * This is markdown
   */
  body: string;
  date: string;
  description?: string;
  keywords?: string[];
  primary_image: IStoryBlokAssetMeta;
  designer?: IDesigner;
};

export type IBlogStoryMeta = TypeSafeOmit<IBlogStory, "body" | "designer">;

export class StoryBlokClientClass extends StoryBlokClientBaseClass<IBlogStory> {
  constructor(token?: string, isDraft?: boolean) {
    super(token, isDraft);
  }

  grabBlogStory(slug: string) {
    return this.grabStoryBlockBySlug(`blog/${slug}`, ["blogpost.designer"]);
  }

  getTags() {
    return this.grabTags({
      starts_with: "blog",
    });
  }

  async grabStroyBlokBlogLinks() {
    const data = await this.grabStoryBlokLinks({ starts_with: "blog" });
    if (null === data) return [];

    const links = Object.keys(data.links)
      .map((l) => data.links[l])
      .filter((l) => l.slug.match(/^blog\//gi));

    return links;
  }

  async grabStoryBlokBlogPageCount() {
    const result = await this.grabStories({
      per_page: 1,
      excluding_fields: ["body"],
      starts_with: "blog",
    });

    result;

    return result?.total || 0;
  }

  async grabBlogMeta(
    page: number,
    perPage: number
  ): Promise<
    (IStoriesResponse<IBlogStoryMeta> & IStoriesCollectionInterface) | null
  > {
    const result = await this.grabStories({
      excluding_fields: ["body"],
      page: page,
      per_page: perPage,

      starts_with: "blog",
    });

    return result;
  }
}

const StoryBlokClient = new StoryBlokClientClass();

export default StoryBlokClient;
