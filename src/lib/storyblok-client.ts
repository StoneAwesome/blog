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
  tag_list: any[];
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

export interface IStoryBlokStoryResponse<
  TContentType extends IStoryBlokContent
> {
  story: IStoryBlockStory<TContentType>;
  cv: number;
  rels: IStoryBlockStory[];
  links: number[];
}

type IBlogStory = IStoryBlokContent & {
  title: string;
  subtitle: string;
  /**
   * This is markdown
   */
  body: string;
  date: string;
  description?: string;
  keywords?: string[];
};

interface IStoryBlokLinksResponse {
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

class StoryBlokClientClass {
  constructor(
    private token: string = process.env.NEXT_PUBLIC_STORYBLOK_READONLY_KEY
  ) {}

  grabStoryBlockByUUID<T extends IStoryBlokContent>(
    uuid: string,
    isDraft = false
  ) {
    return this.grabStory<T>(`cdn/stories/${uuid}`, {
      isDraft: isDraft,
      find_by: "uuid",
    });
  }

  grabStoryBlockByID<T extends IStoryBlokContent>(id: number, isDraft = false) {
    return this.grabStory<T>(`cdn/stories/${id}`, {
      isDraft: isDraft,
    });
  }
  grabBlogStory(slug: string, isDraft: boolean = false) {
    return this.grabStory<IBlogStory>(`cdn/stories/blog/${slug}`, {
      isDraft: isDraft,
    });
  }

  async grabStroyBlokBlogLinks(isDraft = false) {
    const data = await this.grabStoryBlokLinks(isDraft);

    if (null === data) return [];

    const links = Object.keys(data.links)
      .map((l) => data.links[l])
      .filter((l) => l.slug.match(/^blog\//gi));

    return links;
  }

  private async grabStoryBlokLinks(isDraft = false) {
    const links = await this.executeCall<IStoryBlokLinksResponse>(`cdn/links`, {
      isDraft: isDraft,
    });
    return links;
  }

  private async grabStory<T extends IStoryBlokContent>(
    slug: string,
    options: {
      isDraft?: boolean;
      find_by?: "uuid";
      resolve_relations?: string[];
    }
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
            data.story.content[prop] = JSON.parse(JSON.stringify(storyForProp));
          }
        }
      });
    }

    return data;
  }

  private async executeCall<
    T extends IStoryBlokStoryResponse<any> | IStoryBlokLinksResponse
  >(
    slug: string,
    options: {
      isDraft?: boolean;
      find_by?: "uuid";
      resolve_relations?: string[];
    }
  ): Promise<T | null> {
    try {
      const url = `https://api.storyblok.com/v2/${slug}?version=${
        options.isDraft ? "draft" : "published"
      }&token=${this.token}${options.find_by ? "&find_by=uuid" : ""}${
        options.resolve_relations
          ? `&resolve_relations=${options.resolve_relations.join(",")})}`
          : ""
      }`;
      const result = await fetch(url).then((r) => {
        if (r.status !== 200) {
          return null;
        }
        return r.json();
      });

      return !result ? null : result;
    } catch (e) {
      console.log(e);
    }

    return null;
  }
}

const StoryBlokClient = new StoryBlokClientClass();

export default StoryBlokClient;
