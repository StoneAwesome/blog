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
  return (
    <div className="d-flex flex-column">
      <div className={"d-flex justify-content-between gap-5"}>
        {current > 1 && (
          <Link href={link.href(prevPage)} as={link.as(prevPage)}>
            <a className={`btn btn-primary col`}>{"Newer"}</a>
          </Link>
        )}
        {current < pages && (
          <Link href={link.href(nextPage)} as={link.as(nextPage)}>
            <a className={`btn btn-primary col`}>{"Older"}</a>
          </Link>
        )}
      </div>
      {/* <small className="align-self-center text-muted">{current}</small> */}
    </div>
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
  );
}
