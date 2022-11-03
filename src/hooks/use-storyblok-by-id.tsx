import StoryBlokClient, { IStoryBlokContent } from "@lib/storyblok-client";
import { useStoryblokBridge } from "@storyblok/react";
import useSWR from "swr";

export function useStoryblokById<T extends IStoryBlokContent>(id: string) {
  const { data, mutate } = useSWR(`StoryBlok_${id}`, () =>
    StoryBlokClient.grabStoryBlockByUUID<T>(id)
  );

  useStoryblokBridge(data?.story?.id || 0, (s) => mutate(s as any));

  return data;
}
