import Link from "next/link";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import StoryBlockImage from "./storyblok/storyblok-image";

export type MarkdownRendererProps = {
  markdown: string;
  className?: string;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = (props) => {
  return (
    <ReactMarkdown
      children={props.markdown}
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
      }}
      className={props.className}
    />
  );
};

export default MarkdownRenderer;
