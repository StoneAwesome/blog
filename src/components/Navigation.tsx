import Link from "next/link";
import config from "../lib/config";


export default function Navigation() {
  return (
    <>
      <div className="text-center pt-5 bottom-shadow pb-3">
        <div className="container">
          <a href="/" aria-label="StoneAwesome">
            <img src={"/logo/logo-horizontal.svg"} className={"img-fluid"} />
            {/* <h1 className="f2">The Bootstrap Blog</h1> */}
          </a>
          <p className="lead  mt-4 text-center">
            {config.site_description}
          </p>
        </div>
      </div>
      {/* <nav className="bottom-shadow pt-2 pb-3 pb-md-2">
        <div className="container d-flex align-items-md-center py-2">
          <nav className="nav mx-auto">
            <Link href="/">
              <a className={"py-1 me-3"}>{"Home"}</a>
            </Link>
            <Link href="/posts">
              <a className={"py-1 me-3"}>blog</a>
            </Link>
          </nav>
        </div>
      </nav> */}
    </>
  );
}
