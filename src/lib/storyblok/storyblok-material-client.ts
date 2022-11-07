import StoryBlokClientBaseClass, {
  IStoriesResponse,
} from "@lib/storyblok/storyblok-client-base";

class StoryBlokMaterialClientClass extends StoryBlokClientBaseClass<any> {
  constructor(
    token: string = process.env.NEXT_PUBLIC_STORYBLOK_READONLY_KEY,
    isDraft: boolean = !!process.env.NEXT_PUBLIC_STORYBLOK_IS_DRAFT
  ) {
    super(token, isDraft);
  }

  async grabMaterialStories() {
    const data = await this.executeCall<IStoriesResponse<any>>("cdn/stories", {
      starts_with: "material/",
      is_startpage: 1,
    });
    return data?.stories || [];
  }
}

const StoryBlokMaterialClient = new StoryBlokMaterialClientClass();

export default StoryBlokMaterialClient;
