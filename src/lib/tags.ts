import tags from "../../meta/tags.yml";
import materials from "../../meta/materials.yml";

export type TagContent = {
  readonly slug: string;
  readonly name: string;
};

const tagMap: { [key: string]: TagContent } = generateTagMap(tags.tags);
const materialMap: { [key: string]: TagContent } = generateTagMap(
  materials.materials
);

function generateTagMap(vals: any): { [key: string]: TagContent } {
  let result: { [key: string]: TagContent } = {};
  for (const tag of vals) {
    result[tag.slug] = tag;
  }
  return result;
}

export function getTag(slug: string) {
  return tagMap[slug] || materialMap[slug];
}

export function listTags(): TagContent[] {
  return [...tags.tags, ...materials.materials];
}
