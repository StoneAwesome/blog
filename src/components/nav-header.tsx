import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import Search from "./basic/search";
import BasicContainer from "./basic/basic-container";

export default function NavHeader() {
  return (
    <>
      <header className="body-font border-b text-gray-600">
        <BasicContainer noMB>
          <div className="container  mx-auto flex flex-col flex-wrap items-center pt-5 pb-3 md:flex-row ">
            <Link
              href="/"
              aria-label="StoneAwesome"
              className="order-first mb-4 flex w-2/3 items-center sm:w-1/2 md:mb-0 lg:order-none lg:w-2/6 lg:items-center lg:justify-center"
            >
              <img
                src={"/logo/logo-horizontal.svg"}
                className={""}
                alt={"StoneAwesome Logo"}
                height={111.574}
                width={906.667}
              />
            </Link>
            <nav className="flex flex-wrap items-center text-lg  md:ml-auto lg:w-2/5 lg:text-xl">
              <LinkSpecial href="/instagram">
                <FontAwesomeIcon
                  icon={faInstagram}
                  fixedWidth
                  className={"me-1"}
                />
                {"Inspiration"}
              </LinkSpecial>

              <LinkSpecial href="/blog">{"Blog"}</LinkSpecial>

              <Search />
            </nav>
          </div>
        </BasicContainer>
      </header>
    </>
  );
}

export const LINK_SPECIAL_CLASS =
  "rounded p-1 px-3  text-_bsPrimary underline decoration-_bsInfo hover:bg-_bsInfo/10 hover:text-_bsPrimary/90 active:bg-_bsInfo/40";
const LinkSpecial: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <Link href={href} className={LINK_SPECIAL_CLASS}>
    {children}
  </Link>
);
