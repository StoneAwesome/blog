import StoryBlokClientBaseClass, {
  IStoryBlokAssetMeta,
  IStoryBlokContent,
} from "@lib/storyblok/storyblok-client-base";

export interface IStoryBlokMaterialContent extends IStoryBlokContent {
  name: string;
  type: string;
  images: IStoryBlokAssetMeta[];
  component: string;
  composition: string[];
  description: string;
  requires_sealing: boolean;
  stain_resistance: string;
}

class StoryBlokMaterialClientClass extends StoryBlokClientBaseClass<IStoryBlokMaterialContent> {
  constructor(token?: string, isDraft?: boolean) {
    super(token, isDraft);
  }

  async grabMaterialStories() {
    const data = await this.grabStories({
      starts_with: "material/",
      is_startpage: 1,
    });
    return data?.stories || [];
  }
}

const StoryBlokMaterialClient = new StoryBlokMaterialClientClass();

export default StoryBlokMaterialClient;
