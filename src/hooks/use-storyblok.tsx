import { useEffect, useState } from "react";
import { IStoryBlockStory, IStoryBlokContent } from "@lib/storyblok-client";

export const IsInStoryBlok = () => !!window.storyblok;
export default function useStoryBlokLive<TContent extends IStoryBlokContent>(
  originalStory: IStoryBlockStory<TContent>,
  relations?: {
    type: string;
    fields: StringKey<TContent>[];
  }
) {
  let [story, setStory] = useState(originalStory);

  // adds the events for updating the visual editor
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#initializing-the-storyblok-js-bridge
  function initEventListeners() {
    if (window.storyblok) {
      window.storyblok.init();

      // reload on Next.js page on save or publish event in the Visual Editor
      window.storyblok.on(["change", "published"], () => location.reload());

      // live update the story on input events
      window.storyblok.on("input", (event) => {
        console.log("Event", {
          eventUID: event?.story?.content._uid,
          storyID: story.uuid,
          storyCTI: story.content._uid,
        });
        if (event?.story?.content._uid === story.content?._uid) {
          event.story.content = window.storyblok.addComments(
            event.story.content,
            event?.story?.uuid
          );
          if (relations) {
            window.storyblok.resolveRelations(
              event.story,
              relations.fields.map((f) => `${relations.type}.${f}`),
              () => {
                setStory(event.story as any);
              }
            );
          } else {
            setStory(event.story as any);
          }
        }
      });
    }
  }

  // appends the bridge script tag to our document
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#installing-the-storyblok-js-bridge
  function addBridge(callback: () => void) {
    // check if the script is already present
    const existingScript = document.getElementById("storyblokBridge");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://app.storyblok.com/f/storyblok-latest.js?t=${process.env.NEXT_PUBLIC_STORYBLOK_READONLY_KEY}`;
      script.id = "storyblokBridge";
      document.body.appendChild(script);
      script.onload = () => {
        // once the scrip is loaded, init the event listeners
        callback();
      };
    } else {
      callback();
    }
  }

  useEffect(() => {
    // first load the bridge, then initialize the event listeners
    addBridge(initEventListeners);
  });

  return story;
}
