import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

export type InstagramCaptionProps = {
  caption: string;
};

const InstagramCaption: React.FC<{ caption: string }> = ({ caption }) => {
  const strings = caption.split("\u000A");
  return (
    <div className={"flex flex-col gap-2"}>
      {strings.map((s, i) => (
        <SmartString v={s} key={i} />
      ))}
    </div>
  );
};

const SmartString: React.FC<{ v: string }> = ({ v }) => {
  const atIndexes = findMatches(/(\@[\w\d\_]+)/gi, v).map((x) => ({ ...x, type: "@" as const }));
  const tagIndexes = findMatches(/(\#[\w\d\_]+)/gi, v).map((x) => ({ ...x, type: "#" as const }));
  const hrefTags = findMatches(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gi,
    v
  ).map((x) => ({ ...x, type: "href" as const }));
  const indexes = [...atIndexes, ...tagIndexes, ...hrefTags].sort((a, b) =>
    a.start < b.start ? -1 : a.start > b.start ? 1 : 0
  );

  let lastIdx = 0;
  const final: { s: string; type: "@" | "#" | "href" | "T" }[] = [];

  for (let i = 0; i < indexes.length; i++) {
    const tag = indexes[i];

    //-- Did we miss some text in between
    if (lastIdx < tag.start) {
      final.push({ s: v.substring(lastIdx, tag.start), type: "T" });
    }

    const text = v.substring(tag.start, tag.end);

    if (text) {
      final.push({ s: text, type: tag.type });
    }

    lastIdx = tag.end;
  }

  if (final.length === 0) {
    return <span>{v}</span>;
  }

  return (
    <div className="flex flex-wrap items-center">
      {final.map((v, i) => {
        if (v.type === "@") {
          return (
            <a
              href={`https://www.instagram.com/${v.s.substring(1)}`}
              className="m-1 instagram-link"
              key={i}
              target={"_blank"}
            >
              {v.s}
            </a>
          );
        } else if (v.type === "#") {
          return (
            <a
              href={`https://www.instagram.com/explore/tags/${v.s.substring(1)}/`}
              className="m-1 instagram-link"
              target={"_blank"}
              key={i}
            >
              {v.s}
            </a>
          );
        } else if (v.type === "href") {
          return (
            <a href={v.s} className="m-1" key={i} target={"_blank"}>
              {v.s}
            </a>
          );
        }
        return <span key={i}>{v.s}</span>;
      })}
    </div>
  );
};

function findMatches(reg: RegExp, val: string) {
  let positions: { start: number; end: number }[] = [];
  let match: RegExpExecArray | null = null;
  while ((match = reg.exec(val)) != null) {
    positions.push({ start: match.index, end: match.index + match[0].length });
  }

  return positions;
}

export default InstagramCaption;
