import Link from "next/link";
import config from "@lib/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/router";
import React from "react";

const LINK_CLASSNAME = "bg- nav-link text-primary mx-2";
const LINK_STYLE: React.CSSProperties = { textDecoration: "underline var(--bs-info)" };

export default function NavHeader() {
  return (
    <>
      <div className="text-center pt-5 bottom-shadow pb-3">
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
      <div className="bg-_bsLight border-t border-b flex justify-center">
        <div className="py-2 flex gap-4 text-xl">
          <LinkSpecial href="/instagram">
            <FontAwesomeIcon icon={faInstagram} fixedWidth className={"me-1"} />
            {"Inspiration"}
          </LinkSpecial>

          <LinkSpecial href="/posts">{"Blog"}</LinkSpecial>
        </div>
      </div>
    </>
  );
}

const LinkSpecial: React.FC<React.PropsWithChildren<{ href: string }>> = ({ href, children }) => (
  <Link href={href}>
    <a
      className={"px-3 text-_bsPrimary hover:text-_bsPrimary/90  decoration-_bsInfo p-1 underline"}
    >
      {children}
    </a>
  </Link>
);
