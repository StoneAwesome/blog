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
    <div className={"pagination"}>
      {pagination.map((it, i) => (
        <div key={i} className={`page-item ${it.page === current ? "active" : ""}`}>
          {it.excerpt ? (
            "..."
          ) : (
            <Link href={link.href(it.page)} as={link.as(it.page)}>
              <a className={`page-link`}>{it.page}</a>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
