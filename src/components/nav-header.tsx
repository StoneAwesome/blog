import Link from "next/link";
import config from "@lib/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const LINK_CLASS = "py-1 me-3 text-decoration-none";
export default function NavHeader() {
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
            {/* <h1 className="f2">The Bootstrap Blog</h1> */}
          </a>
          <p className="lead  mt-4 text-center">{config.site_description}</p>
        </div>
      </div>
      <nav className="border-bottom">
        <div className="container d-flex align-items-md-center py-2">
          <nav className="nav mx-auto">
            <Link href="/posts">
              <a className={LINK_CLASS}>{"Blog"}</a>
            </Link>
            {/* <Link href="/tags">
              <a className={LINK_CLASS}>{"Tags"}</a>
            </Link> */}
            <Link href="/instagram">
              <a className={LINK_CLASS}>
                <FontAwesomeIcon icon={faInstagram} fixedWidth className={"me-2"} />
                {"Instagram Feed"}
              </a>
            </Link>
          </nav>
        </div>
      </nav>
    </>
  );
}
