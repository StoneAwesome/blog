import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import * as React from "react";

export type SocialLinkProps = {
  service: "facebook" | "instagram";
  handle: string;
};

const SocialLink: React.FC<SocialLinkProps> = (props) => {
  return (
    (<Link
      href={`${
        props.service === "facebook"
          ? "https://facebook.com"
          : "https://instagram.com"
      }/${props.handle}`}
      target={"_blank"}
      className={`${
        props.service === "instagram" ? "instagram-link" : "facebook-link"
      } px-3`}>

      <FontAwesomeIcon
        icon={props.service === "facebook" ? faFacebook : faInstagram}
      />

    </Link>)
  );
};

export default SocialLink;
