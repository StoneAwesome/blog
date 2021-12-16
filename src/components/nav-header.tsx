import Link from "next/link";
import config from "@lib/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/router";
import React from "react";

const LINK_CLASS = "nav-link text-primary mx-2";
const LINK_STYLE: React.CSSProperties = { textDecoration: "underline var(--bs-info)" };
export default function NavHeader() {
  const router = useRouter();
  return (
    <>
      <div className="text-center pt-5 bottom-shadow pb-3">
        <div className="container">
          <a href="/" aria-label="StoneAwesome">
            <img
              src={"/logo/logo-horizontal.svg"}
              className={"img-fluid"}
              alt={"StoneAwesome Logo"}
              height={111.574}
              width={906.667}
            />
          </a>
          <p className="lead  mt-4 text-center">{config.site_description}</p>
        </div>
      </div>
      <nav className="navbar navbar-expand navbar-light border-bottom" aria-label="Header">
        <div className="container-fluid">
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav">
              {/* <Link href="/tags">
              <a className={LINK_CLASS}>{"Tags"}</a>
            </Link> */}

              <li className="nav-item">
                <Link href="/posts">
                  <a className={LINK_CLASS} style={LINK_STYLE}>
                    {"Blog"}
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/instagram">
                  <a className={LINK_CLASS} style={LINK_STYLE}>
                    <FontAwesomeIcon icon={faInstagram} fixedWidth className={"me-1"} />
                    {"Instagram"}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
