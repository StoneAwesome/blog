import React from "react";
import config from "@lib/config";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faPinterest, faTwitter } from "@fortawesome/free-brands-svg-icons";

const DEFAULT_PROPS: Partial<FontAwesomeIconProps> = {
  fixedWidth: true,
  size: "2x",
};
export function SocialList({}) {
  return (
    <div className={"flex justify-center mb-3"}>
      <div className={"flex gap-4 [&>*]:text-_bsPrimary hover:[&>*]:text-_bsPrimary/90 "}>
        <a
          title="Twitter"
          href={`https://twitter.com/${config.twitter_account}`}
          target="_blank"
          rel="noopener"
        >
          <FontAwesomeIcon icon={faTwitter} {...DEFAULT_PROPS} />
        </a>
        <a
          title="GitHub"
          href={`https://github.com/${config.github_account}`}
          target="_blank"
          rel="noopener"
        >
          <FontAwesomeIcon icon={faGithub} {...DEFAULT_PROPS} />
        </a>
        <a
          title="Instagram"
          href={`https://instagram.com/${config.instagram_account}`}
          target="_blank"
          rel="noopener"
        >
          <FontAwesomeIcon icon={faInstagram} {...DEFAULT_PROPS} />
        </a>
        <a
          title="Pinterest"
          href={`https://pinterest.com/${config.pinterest_account}`}
          target="_blank"
          rel="noopener"
        >
          <FontAwesomeIcon icon={faPinterest} {...DEFAULT_PROPS} />
        </a>
      </div>
    </div>
  );
}
