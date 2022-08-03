import tags from "../../meta/tags.yml";
import materials from "../../meta/materials.yml";
import colors from "../../meta/colors.yml";

export type TagContent = {
  readonly slug: string;
  readonly name: string;
};

const tagMap: { [key: string]: TagContent } = generateTagMap(tags.tags);
const materialMap: { [key: string]: TagContent } = generateTagMap(
  materials.materials
);
const colorsMap: { [key: string]: TagContent } = generateTagMap(colors.colors);

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
  return [...tags.tags, ...materials.materials, ...colors.colors];
}
