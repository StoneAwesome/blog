export interface IStoryBlokContent {
  _uid: string;
}

export interface IStoryBlockStory<
  TContentType extends IStoryBlokContent = IStoryBlokContent
> {
  name: string;
  created_at: Date;
  published_at: Date;
  id: number;
  uuid: string;
  content: TContentType;
  slug: string;
  full_slug: string;
  sort_by_date: null;
  position: number;
  tag_list: string[];
  is_startpage: boolean;
  parent_id: number;
  meta_data: null;
  group_id: string;
  first_published_at: Date;
  release_id: null;
  lang: string;
  path: string;
  alternates: any[];
  default_full_slug: null;
  translated_slugs: null;
}

interface IStoriesCollectionInterface {
  total: number;
  per_page: number;
  page: number;
}

export interface IStoriesResponse<TContentType extends IStoryBlokContent>
  extends IStoriesCollectionInterface {
  stories: IStoryBlockStory<TContentType>[];
}

export interface ITagsResponse extends IStoriesCollectionInterface {
  tags: {
    name: string;
    taggings_count: number;
  }[];
}

export interface IStoryBlokStoryResponse<
  TContentType extends IStoryBlokContent
> {
  story: IStoryBlockStory<TContentType>;
  cv: number;
  rels: IStoryBlockStory[];
  links: number[];
}

export interface IStoryBlokAssetMeta {
  id: number | null;
  alt: null | string;
  name: string;
  focus: null | string;
  title: null | string;
  filename: string;
  copyright: null | string;
  fieldtype: string;
  is_external_url?: boolean;
}

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

export type IBlogStoryMeta = IStoryBlockStory<
  TypeSafeOmit<IBlogStory, "body" | "designer">
>;

interface IStoryBlokLinksResponse extends IStoriesCollectionInterface {
  links: { [key: string]: IStoryBlokLink };
}

export interface IStoryBlokLink {
  id: number;
  slug: string;
  name: string;
  is_folder: boolean;
  parent_id: number;
  published: boolean;
  path: null | string;
  position: number;
  uuid: string;
  is_startpage: boolean;
  real_path: string;
}

type IRequestOptions = {
  isDraft?: boolean;
  find_by?: "uuid";
  resolve_relations?: string[];
  excluding_fields?: string[];
  by_uuids?: string[];
  page?: number;
  per_page?: number;
  with_tag?: string[];
  starts_with?: "blog" | "material";
};

function buildSafeJoin(options: IRequestOptions) {
  return (
    x: JustParticularKeys<
      IRequestOptions,
      string[] | string | number | undefined
    >
  ) => (x ? safeJoin(x, options[x]) : "");
}

function safeJoin(key: string, value: string[] | undefined | number | string) {
  if (!value) return "";
  const qsV = Array.isArray(value) ? value.join(",") : value;
  return `&${key}=${qsV}`;
}

class StoryBlokClientClass {
  constructor(
    private token: string = process.env.NEXT_PUBLIC_STORYBLOK_READONLY_KEY,
    private isDraft: boolean = !!process.env.NEXT_PUBLIC_STORYBLOK_IS_DRAFT
  ) {}

  grabStoryBlockByUUID<T extends IStoryBlokContent>(uuid: string) {
    return this.grabStory<T>(`cdn/stories/${uuid}`, {
      isDraft: this.isDraft,
      find_by: "uuid",
    });
  }

  grabStoryBlockByID<T extends IStoryBlokContent>(id: number) {
    return this.grabStory<T>(`cdn/stories/${id}`, {
      isDraft: this.isDraft,
    });
  }
  grabBlogStory(slug: string) {
    return this.grabStory<IBlogStory>(`cdn/stories/blog/${slug}`, {
      isDraft: this.isDraft,
      resolve_relations: ["blogpost.designer"],
    });
  }
  async grabBlogStoriesByTag(tag: string, page: number, pageSize: number) {
    const result = await this.executeCall<IStoriesResponse<IBlogStory>>(
      "cdn/stories",
      {
        page: page,
        per_page: pageSize,
        with_tag: [tag],
        isDraft: this.isDraft,
      }
    );
    return result;
  }
  async getTags() {
    const result = await this.executeCall<ITagsResponse>("cdn/tags", {
      starts_with: "blog",
      isDraft: this.isDraft,
    });

    return result;
  }

  async grabStroyBlokBlogLinks() {
    const data = await this.grabStoryBlokLinks();

    if (null === data) return [];

    const links = Object.keys(data.links)
      .map((l) => data.links[l])
      .filter((l) => l.slug.match(/^blog\//gi));

    return links;
  }

  async grabStoryBlokBlogPageCount() {
    const result = await this.executeCall<IStoriesResponse<IBlogStory>>(
      "cdn/stories/",
      {
        isDraft: this.isDraft,
        per_page: 1,
        excluding_fields: ["body"],
        starts_with: "blog",
      }
    );
    return result?.total || 0;
  }

  async grabStoryBlokBlogMeta(page: number, perPage: number) {
    const result = await this.executeCall<IStoriesResponse<IBlogStory>>(
      "cdn/stories",
      {
        excluding_fields: ["body"],
        page: page,
        per_page: perPage,
        isDraft: this.isDraft,
        starts_with: "blog",
      }
    );

    return result;
  }

  private async grabStoryBlokLinks() {
    const links = await this.executeCall<IStoryBlokLinksResponse>(`cdn/links`, {
      isDraft: this.isDraft,
    });
    return links;
  }

  private async grabStory<T extends IStoryBlokContent>(
    slug: string,
    options: IRequestOptions
  ): Promise<IStoryBlokStoryResponse<T> | null> {
    const data = await this.executeCall<IStoryBlokStoryResponse<T>>(
      slug,
      options
    );

    if (!data) return null;

    if (options.resolve_relations) {
      options.resolve_relations.map((r) => {
        const prop = r.split(".")[1] as keyof T;

        if (prop && data?.story?.content?.[prop]) {
          const id = data.story.content[prop];
          const storyForProp = data.rels?.find((r: any) => r.uuid === id);

          if (storyForProp) {
            data.story.content[prop] = JSON.parse(
              JSON.stringify(storyForProp.content)
            );
          }
        }
      });
    }

    return data;
  }

  private async executeCall<
    T extends
      | IStoryBlokStoryResponse<any>
      | IStoryBlokLinksResponse
      | IStoriesResponse<any>
      | ITagsResponse
  >(
    slug: string,
    options: IRequestOptions
  ): Promise<(T & IStoriesCollectionInterface) | null> {
    try {
      const sj = buildSafeJoin(options);
      let total = 0,
        per_page = 0,
        page = 0;
      const url = `https://api.storyblok.com/v2/${slug}?version=${
        options.isDraft ? "draft" : "published"
      }&token=${this.token}${options.find_by ? "&find_by=uuid" : ""}${sj(
        "resolve_relations"
      )}${sj("excluding_fields")}${sj("by_uuids")}${sj("starts_with")}${sj(
        "per_page"
      )}${sj("page")}${sj("with_tag")}`;

      const result = await fetch(url).then((r) => {
        if (r.status !== 200) {
          return null;
        }
        total = parseInt(r.headers.get("total") || "0");
        per_page = parseInt(r.headers.get("per_page") || "0");
        page = parseInt(r.headers.get("page") || "0");

        return r.json();
      });

      return !result ? null : { ...result, total, per_page, page };
    } catch (e) {
      console.log(e);
    }

    return null;
  }
}

const StoryBlokClient = new StoryBlokClientClass();

export default StoryBlokClient;
