import { faCalendarDay } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, formatISO } from "date-fns";

type Props = {
  date: Date;
};
export default function DateView({ date }: Props) {
  return (
    <div className={"d-flex align-items-center"}>
      <FontAwesomeIcon icon={faCalendarDay} fixedWidth className={"me-2"} />
      <time dateTime={formatISO(date)} className={"text-nowrap"}>
        <span className={"text-muted"}>{format(date, "LLLL d, yyyy")}</span>
      </time>
    </div>
  );
}
