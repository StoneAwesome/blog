import Link from "next/link";
import config from "@lib/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/router";
import React from "react";
import { faPlus } from "@fortawesome/pro-thin-svg-icons";
import Search from "./basic/search";

const LINK_CLASSNAME = "bg- nav-link text-primary mx-2";
const LINK_STYLE: React.CSSProperties = {
  textDecoration: "underline var(--bs-info)",
};

export default function NavHeader() {
  return (
    <>
      <div className="bottom-shadow pt-5 pb-3 text-center">
        <div className="container mx-auto flex flex-col items-center">
          <a href="/" aria-label="StoneAwesome">
            <img
              src={"/logo/logo-horizontal.svg"}
              className={"max-w-[50vw]"}
              alt={"StoneAwesome Logo"}
              height={111.574}
              width={906.667}
            />
          </a>
          {/* <p className="lead  mt-4 text-center">{config.site_description}</p> */}
        </div>
      </div>
      <div className="flex justify-center border-t border-b bg-_bsLight">
        <div className="flex gap-4 py-2 text-xl">
          <LinkSpecial href="/instagram">
            <FontAwesomeIcon icon={faInstagram} fixedWidth className={"me-1"} />
            {"Inspiration"}
          </LinkSpecial>

          <LinkSpecial href="/posts">{"Blog"}</LinkSpecial>
          <Search />

          {/* <LinkSpecial href="/posts">
            <FontAwesomeIcon icon={faPlus} fixedWidth className={"me-1"} />
            {"Submit Your Designs"}
          </LinkSpecial> */}
        </div>
      </div>
    </>
  );
}

export const LINK_SPECIAL_CLASS =
  "rounded p-1 px-3  text-_bsPrimary underline decoration-_bsInfo hover:bg-_bsInfo/10 hover:text-_bsPrimary/90 active:bg-_bsInfo/40";
const LinkSpecial: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <Link href={href}>
    <a className={LINK_SPECIAL_CLASS}>{children}</a>
  </Link>
);
