import { faCalendarDay } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, formatISO } from "date-fns";

type Props = {
  date: Date;
};
export default function DateView({ date }: Props) {
  return (
    <div className={"flex items-center"}>
      <FontAwesomeIcon icon={faCalendarDay} fixedWidth className={"me-2"} />
      <time dateTime={formatISO(date)} className={"text-nowrap"}>
        <span className={"text-gray-600"}>{format(date, "LLLL d, yyyy")}</span>
      </time>
    </div>
  );
}
