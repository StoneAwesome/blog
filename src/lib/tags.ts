import tags from "../../meta/tags.yml";

export type TagContent = {
  readonly slug: string;
  readonly name: string;
};

const tagMap: { [key: string]: TagContent } = generateTagMap(tags.tags);
const materialMap: { [key: string]: TagContent } = generateTagMap(
  tags.materials
);
const colorsMap: { [key: string]: TagContent } = generateTagMap(tags.colors);

function generateTagMap(vals: any): { [key: string]: TagContent } {
  let result: { [key: string]: TagContent } = {};
  for (const tag of vals) {
    result[tag.slug] = tag;
  }
  return result;
}

export function getTag(slug: string) {
  return tagMap[slug] || materialMap[slug] || colorsMap[slug];
}

export function listTags(): TagContent[] {
  return [...tags.tags, ...tags.materials, ...tags.colors];
}

export function listTagsByType() {
  return {
    colors: [...tags.colors] as TagContent[],
    materials: [...tags.materials] as TagContent[],
    tags: [...tags.tags] as TagContent[],
  };
}
