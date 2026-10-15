import { cn } from "../../lib/style-utils";
import { SEVERITY_SWATCHES } from "../../lib/constants";

const SeverityDot = ({ severity, className }) => {
  return (
    <span
      className={cn("inline-block size-[7px] shrink-0 rounded-[2px]", className)}
      style={{ background: SEVERITY_SWATCHES[severity] }}
    ></span>
  );
};

export { SeverityDot };
