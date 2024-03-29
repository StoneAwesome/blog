import {
  faArrowFromLeft,
  faArrowToLeft,
  faLongArrowLeft,
  faLongArrowRight,
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { generatePagination } from "@lib/pagination";
import Link from "next/link";

type Props = {
  current: number;
  pages: number;
  link: {
    href: (page: number) => string;
    as: (page: number) => string;
  };
};
export default function Pagination({ current, pages, link }: Props) {
  //const pagination = generatePagination(current, pages);
  const nextPage = current + 1;
  const prevPage = current - 1;
  if (pages <= 0) return null;
  return (
    //   <div className={"pagination justify-content-center"}>
    //   {pagination.map((it, i) => (
    //     <div
    //       key={i}
    //       className={`page-item ${it.page === current ? "active" : it.excerpt ? "disabled" : ""}`}
    //     >
    //       {it.excerpt ? (
    //         <a className="page-link">
    //           <FontAwesomeIcon icon={faEllipsisH} fixedWidth />
    //         </a>
    //       ) : it.page !== null ? (
    //         <Link href={link.href(it.page)} as={link.as(it.page)}>
    //           <a className={`page-link ${i === 0 || i === pagination.length - 1 ? "px-5" : ""}`}>
    //             {it.page}
    //           </a>
    //         </Link>
    //       ) : null}
    //     </div>
    //   ))}
    // </div>
    <div className="my-5 flex flex-col">
      <div className={"flex flex-row gap-5 "}>
        {current >= pages ? null : (
          <Link
            href={link.href(nextPage)}
            as={link.as(nextPage)}
            className={`flex-grow rounded-sm bg-_bsPrimary py-1 text-center text-white hover:bg-_bsPrimary/90 active:bg-_bsPrimary active:ring-1 active:ring-_bsPrimary active:ring-offset-2 ${
              current >= pages ? "disabled" : ""
            }`}
            title={"Older"}
          >
            {<FontAwesomeIcon icon={faLongArrowLeft} fixedWidth />}
          </Link>
        )}

        {current <= 1 ? null : (
          <Link
            href={link.href(prevPage)}
            as={link.as(prevPage)}
            className={`flex-grow rounded-sm bg-_bsPrimary py-1 text-center text-white hover:bg-_bsPrimary/90 active:bg-_bsPrimary active:ring-1 active:ring-_bsPrimary active:ring-offset-2 ${
              current <= 1 ? "disabled" : ""
            }`}
            title={"Newer"}
          >
            {<FontAwesomeIcon icon={faLongArrowRight} fixedWidth />}
          </Link>
        )}
      </div>
      {/* <small className="align-self-center text-muted">{current}</small> */}
    </div>
  );
}
