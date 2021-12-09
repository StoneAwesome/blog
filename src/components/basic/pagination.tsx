import { faEllipsisH } from "@fortawesome/pro-duotone-svg-icons";
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
  const pagination = generatePagination(current, pages);
  return (
    <div className={"pagination justify-content-center"}>
      {pagination.map((it, i) => (
        <div
          key={i}
          className={`page-item ${it.page === current ? "active" : it.excerpt ? "disabled" : ""}`}
        >
          {it.excerpt ? (
            <a className="page-link">
              <FontAwesomeIcon icon={faEllipsisH} fixedWidth />
            </a>
          ) : it.page !== null ? (
            <Link href={link.href(it.page)} as={link.as(it.page)}>
              <a className={`page-link ${i === 0 || i === pagination.length - 1 ? "px-5" : ""}`}>
                {it.page}
              </a>
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
