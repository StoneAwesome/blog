import { faCalendarDay } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, formatISO, parseISO } from "date-fns";

type Props = {
  date: Date | string;
};
export default function DateView({ date }: Props) {
  const dateActual = typeof date === "object" ? date : parseISO(date);
  return (
    <div className={"flex items-center"}>
      <FontAwesomeIcon icon={faCalendarDay} fixedWidth className={"me-2"} />
      <time dateTime={formatISO(dateActual)} className={"text-nowrap"}>
        <span className={"text-gray-600"}>
          {format(dateActual, "LLLL d, yyyy")}
        </span>
      </time>
    </div>
  );
}
