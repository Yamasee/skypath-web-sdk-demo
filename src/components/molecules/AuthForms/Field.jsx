import { TextInput } from "../../atoms/TextInput";
import { cn } from "../../../lib/style-utils";

const Field = ({ label, optional, error, wide, className, ...inputProps }) => {
  return (
    <label className={cn("flex flex-col gap-[7px] text-xs font-medium text-ink-secondary", wide && "col-span-full", className)}>
      <span>
        {label}
        {optional && <span className="font-normal text-ink-dim"> · optional</span>}
      </span>
      <TextInput invalid={Boolean(error)} {...inputProps} />
      {error && <span className="text-[11.5px] font-medium text-danger-ink">{error}</span>}
    </label>
  );
};

export default Field;
