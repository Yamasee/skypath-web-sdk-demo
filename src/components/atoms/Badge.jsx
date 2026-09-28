import { cn } from "../../lib/style-utils";

const Badge = ({ label, value, className }) => {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center rounded-full bg-surface px-3 text-[11.5px] font-semibold text-ink-muted",
        className
      )}
    >
      {label}
      <span className="ml-1.5 font-display font-normal text-ink">{value}</span>
    </span>
  );
};

export { Badge };
