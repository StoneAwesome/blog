import dynamic from "next/dynamic";
import Link from "next/link";
import * as React from "react";
import ReactMarkdown from "react-markdown";
//import StoryBlockImage from "./storyblok/storyblok-image";

export type MarkdownRendererProps = {
  markdown: string;
  className?: string;
};
const StoryBlockImage = dynamic(() => import("./storyblok/storyblok-image"), {
  ssr: false,
});

const MarkdownRenderer: React.FC<MarkdownRendererProps> = (props) => {
  return (
    <ReactMarkdown
      children={props.markdown}
      disallowedElements={["figure"]}
      components={{
        a: ({ node, ...props }) => {
          return (
            <Link
              href={props.href as string}
              target={props.href?.includes("http") ? "_blank" : "_self"}
            >
              {props.children[0]}
            </Link>
          );
        },
        img: (imgProps) => {
          return <StoryBlockImage {...imgProps} />;
        },
        p: (pProps) => {
          const { children } = pProps;

          if (
            children &&
            children[0] &&
            children.length === 1 &&
            (children[0] as any)?.props?.src
          ) {
            // rendering media without p wrapper
            console.log("Is Img", children[0] as any);

            return <>{children}</>;
          }

          return <p>{children}</p>;
        },
      }}
      className={props.className}
    />
  );
};

export default MarkdownRenderer;
